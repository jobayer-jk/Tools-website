"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Download, Music, Trash2, Cpu, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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

const AUDIO_FORMATS = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
};
type OutFormat = keyof typeof AUDIO_FORMATS;

export function AudioConverterClient() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [convertedSrc, setConvertedSrc] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutFormat>("mp3");
  
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
      if (audioSrc) URL.revokeObjectURL(audioSrc);
      if (convertedSrc) URL.revokeObjectURL(convertedSrc);
    };
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith("audio/") && !file.name.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
      toast.error("Please upload a valid audio file.");
      return;
    }
    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setAudioSrc(url);
    if (convertedSrc) URL.revokeObjectURL(convertedSrc);
    setConvertedSrc(null);
    setProgress(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
  };

  const clearAll = () => {
    setAudioFile(null);
    if (audioSrc) URL.revokeObjectURL(audioSrc);
    if (convertedSrc) URL.revokeObjectURL(convertedSrc);
    setAudioSrc(null);
    setConvertedSrc(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const executeConversion = async () => {
    if (!audioFile || !ffmpegRef.current || !ffmpegLoaded) return;
    const ffmpeg = ffmpegRef.current;
    
    try {
      setIsConverting(true);
      setProgress(0);
      
      const ext = audioFile.name.split(".").pop() || "raw";
      const inputName = `input_${Math.random().toString(36).substring(7)}.${ext}`;
      const outputName = `output_${Math.random().toString(36).substring(7)}.${outputFormat}`;

      await ffmpeg.writeFile(inputName, await fetchFile(audioFile));

      // FFmpeg command to convert audio smoothly
      const cmd = ["-i", inputName];
      
      // Add codec specific flags
      if (outputFormat === "mp3") {
        cmd.push("-c:a", "libmp3lame", "-q:a", "2"); // VBR High Quality
      } else if (outputFormat === "ogg") {
        cmd.push("-c:a", "libvorbis", "-q:a", "4"); // Standard Quality
      }
      
      cmd.push(outputName);
      
      await ffmpeg.exec(cmd);

      const data = await ffmpeg.readFile(outputName);
      
      const blob = new Blob([data as BlobPart], { type: AUDIO_FORMATS[outputFormat] });
      const convertedUrl = URL.createObjectURL(blob);
      setConvertedSrc(convertedUrl);

      // Clean up virtual FS
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      toast.success(`Audio converted to ${outputFormat.toUpperCase()} successfully!`);
    } catch (error) {
      console.error(error);
      toast.error("Conversion failed. The file format might be unsupported by the WebAssembly engine.");
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  const downloadAudio = () => {
    if (!convertedSrc || !audioFile) return;
    const link = document.createElement("a");
    link.href = convertedSrc;
    link.download = `${audioFile.name.replace(/\.[^/.]+$/, "")}-converted.${outputFormat}`;
    link.click();
    toast.success("File Downloaded!");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      
      {/* Upload & Preview */}
      <Card className="border-none shadow-sm overflow-hidden flex flex-col min-h-[450px]">
        <div className="border-b bg-muted/20 p-4 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" /> Source Audio
          </span>
          {audioSrc && (
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
               <p className="text-sm mt-2">Downloading WebAssembly audio binaries securely...</p>
             </div>
          ) : !audioSrc ? (
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
              <h3 className="font-semibold text-xl mb-2">Upload Audio</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Select an audio file (MP3, WAV, FLAC, M4A) to transcode locally.
              </p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" className="hidden" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-muted/10 rounded-xl border p-8 min-h-[350px] text-center">
              <div className="bg-emerald-500/10 text-emerald-500 p-6 rounded-2xl mb-4">
                <Music className="h-16 w-16" />
              </div>
              <h3 className="font-bold text-lg max-w-[250px] truncate">{audioFile?.name}</h3>
              <div className="mt-2 text-sm text-muted-foreground font-medium flex gap-4">
                <span>{formatBytes(audioFile?.size || 0)}</span>
              </div>
              <audio src={audioSrc} controls className="mt-8 w-full max-w-[280px]" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Target Format & Conversion Output */}
      <Card className="border-none shadow-sm relative overflow-hidden flex flex-col min-h-[450px]">
        <div className="border-b bg-muted/10 p-4 font-semibold text-muted-foreground">
          Target Output
        </div>
        
        <CardContent className="p-0 flex-1 flex flex-col">
          {!audioSrc ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-8 bg-muted/5 min-h-[300px]">
              <ArrowRightLeft className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">Configure Render Format</p>
              <p className="text-sm mt-2 opacity-70">Upload a track on the left to select an output codec.</p>
            </div>
          ) : !convertedSrc && !isConverting ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/5 space-y-8">
                
                <div className="space-y-4 w-full max-w-xs text-left">
                  <Label className="text-base font-semibold">Convert To</Label>
                  <Select value={outputFormat} onValueChange={(v) => setOutputFormat(v as OutFormat)}>
                    <SelectTrigger className="h-14 bg-background font-bold text-lg uppercase tracking-wider text-center">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp3" className="font-bold uppercase tracking-wider">MP3 (MPEG-3)</SelectItem>
                      <SelectItem value="wav" className="font-bold uppercase tracking-wider">WAV (Lossless)</SelectItem>
                      <SelectItem value="ogg" className="font-bold uppercase tracking-wider">OGG (Vorbis)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={executeConversion} size="lg" className="h-16 w-full max-w-xs text-lg font-bold">
                  Transcode Audio
                </Button>
                
             </div>
          ) : isConverting ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/5">
                <Cpu className="h-16 w-16 text-primary animate-pulse mb-6" />
                <div className="w-full max-w-xs space-y-2">
                   <div className="flex justify-between text-sm font-bold">
                     <span>Transcoding Track...</span>
                     <span>{progress > 100 ? 100 : progress}%</span>
                   </div>
                   <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                     <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress > 100 ? 100 : progress}%` }} />
                   </div>
                </div>
             </div>
          ) : convertedSrc && (
             <div className="flex-1 flex flex-col items-center justify-between p-6 bg-muted/5">
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                   <div className="bg-primary/10 text-primary p-6 rounded-full mb-6 relative">
                      <Music className="h-12 w-12" />
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm border uppercase">
                        {outputFormat}
                      </div>
                   </div>
                   <h3 className="font-bold text-lg max-w-[280px] break-all text-center">
                     {audioFile?.name.replace(/\.[^/.]+$/, "")}-converted.{outputFormat}
                   </h3>
                   <audio src={convertedSrc} controls className="mt-8 w-full max-w-[280px]" />
                </div>
                
                <div className="w-full mt-6 pt-6 border-t">
                  <Button 
                    onClick={downloadAudio} 
                    size="lg"
                    className="w-full gap-2 font-semibold text-base h-14"
                  >
                    <Download className="h-5 w-5" /> Download Audio
                  </Button>
                </div>
             </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
