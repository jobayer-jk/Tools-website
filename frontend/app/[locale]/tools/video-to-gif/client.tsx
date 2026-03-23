"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Download, FileVideo, Trash2, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function VideoToGifClient() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [gifSrc, setGifSrc] = useState<string | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load FFmpeg WASM Core
  const loadFfmpeg = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;

    ffmpeg.on("progress", ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });

    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      setFfmpegLoaded(true);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load FFmpeg engine. Check your connection or browser support.");
    }
  };

  useEffect(() => {
    loadFfmpeg();
    return () => {
      // Cleanup Object URLs on unmount
      if (videoSrc) URL.revokeObjectURL(videoSrc);
    };
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a valid video file (MP4, WebM, etc.).");
      return;
    }
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setGifSrc(null);
    setProgress(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
  };

  const clearAll = () => {
    setVideoFile(null);
    if (videoSrc) URL.revokeObjectURL(videoSrc);
    setVideoSrc(null);
    setGifSrc(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const executeConversion = async () => {
    if (!videoFile || !ffmpegRef.current || !ffmpegLoaded) return;
    const ffmpeg = ffmpegRef.current;
    
    try {
      setIsConverting(true);
      setProgress(0);
      
      const inputName = `input_${videoFile.name.replace(/\s+/g, "_")}`;
      const outputName = "output.gif";

      // Write video to virtual FS
      await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

      // FFmpeg command to convert video to GIF
      // fps=10, scale=320:-1 to optimize size
      await ffmpeg.exec([
        "-i", inputName, 
        "-vf", "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse", 
        "-loop", "0", 
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      
      const blob = new Blob([data as BlobPart], { type: "image/gif" });
      const gifUrl = URL.createObjectURL(blob);
      setGifSrc(gifUrl);

      // Clean up virtual FS
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      toast.success("Video converted to GIF successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Conversion failed. The video might be too large or unsupported.");
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  const downloadGif = () => {
    if (!gifSrc || !videoFile) return;
    const link = document.createElement("a");
    link.href = gifSrc;
    link.download = `${videoFile.name.replace(/\.[^/.]+$/, "")}.gif`;
    link.click();
    toast.success("GIF Downloaded!");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      
      {/* Upload & Video Preview */}
      <Card className="border-none shadow-sm overflow-hidden flex flex-col min-h-[450px]">
        <div className="border-b bg-muted/20 p-4 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileVideo className="h-5 w-5 text-primary" /> Source Video
          </span>
          {videoSrc && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 gap-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" /> Reset
            </Button>
          )}
        </div>
        
        <CardContent className="p-6 flex-1 flex flex-col justify-center">
          {!ffmpegLoaded ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-12 animate-pulse min-h-[300px]">
               <Cpu className="h-16 w-16 mb-4 text-primary" />
               <h3 className="font-bold text-lg">Initializing FFmpeg Engine</h3>
               <p className="text-sm mt-2">Downloading WebAssembly binaries (first run only)...</p>
             </div>
          ) : !videoSrc ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault(); setIsDragging(false);
                if (e.dataTransfer.files?.length) processFile(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12 text-center cursor-pointer min-h-[350px] transition-colors bg-white/50",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/30"
              )}
            >
              <div className="p-4 bg-muted rounded-full mb-4">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Upload Video</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Select a short video (MP4, WebM) to convert to GIF. Max 50MB recommended.
              </p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="video/mp4,video/webm,video/ogg" className="hidden" />
            </div>
          ) : (
            <div className="flex flex-col items-center w-full min-h-[350px]">
              <div className="w-full bg-black/5 rounded-xl border flex flex-col items-center justify-center p-2 mb-4">
                <video 
                  src={videoSrc} 
                  controls 
                  className="max-h-[300px] w-auto max-w-full rounded-md"
                />
              </div>
              <div className="flex items-center justify-between w-full text-sm font-medium mt-auto">
                <span>{videoFile?.name}</span>
                <span className="text-muted-foreground">{formatBytes(videoFile?.size || 0)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversion Output */}
      <Card className="border-none shadow-sm relative overflow-hidden flex flex-col min-h-[450px]">
        <div className="border-b bg-muted/10 p-4 font-semibold text-muted-foreground">
          GIF Output
        </div>
        
        <CardContent className="p-0 flex-1 flex flex-col">
          {!videoSrc ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-8 bg-muted/5 min-h-[300px]">
              <UploadCloud className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">Waiting for Video...</p>
              <p className="text-sm mt-2 opacity-70">Upload a video on the left to begin.</p>
            </div>
          ) : !gifSrc && !isConverting ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/5">
                <Button onClick={executeConversion} size="lg" className="h-16 w-full max-w-xs text-lg font-bold">
                  Convert to GIF
                </Button>
                <p className="text-sm text-muted-foreground mt-4 max-w-[280px]">
                  Conversion happens entirely in your browser using excessive CPU power. Keep the page open.
                </p>
             </div>
          ) : isConverting ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/5">
                <Cpu className="h-16 w-16 text-primary animate-pulse mb-6" />
                <div className="w-full max-w-xs space-y-2">
                   <div className="flex justify-between text-sm font-bold">
                     <span>Processing Frames...</span>
                     <span>{progress > 100 ? 100 : progress}%</span>
                   </div>
                   <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                     <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress > 100 ? 100 : progress}%` }} />
                   </div>
                </div>
             </div>
          ) : gifSrc && (
             <div className="flex-1 flex flex-col items-center justify-between p-6 bg-muted/5">
                <div className="flex-1 flex items-center justify-center w-full checkerboard-bg rounded-xl border p-2">
                  <img src={gifSrc} alt="Converted GIF" className="max-h-[300px] w-auto shadow-md rounded-md" />
                </div>
                
                <div className="w-full mt-6 pt-6 border-t">
                  <Button 
                    onClick={downloadGif} 
                    size="lg"
                    className="w-full gap-2 font-semibold text-base h-14"
                  >
                    <Download className="h-5 w-5" /> Download GIF File
                  </Button>
                </div>
             </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
