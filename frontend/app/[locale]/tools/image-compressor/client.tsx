"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { UploadCloud, Download, Image as ImageIcon, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Format bytes nicely
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function ImageCompressorClient() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [origSrc, setOrigSrc] = useState<string | null>(null);
  
  const [compressedSrc, setCompressedSrc] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  
  const [quality, setQuality] = useState(80); // 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setOrigSrc(url);
    // Compression naturally runs from useEffect now because origSrc changes
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
  };

  const reset = () => {
    setImageFile(null);
    setOrigSrc(null);
    setCompressedSrc(null);
    setCompressedSize(0);
    setQuality(80);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Run Compression algorithm
  const compressImage = () => {
    if (!origSrc || !imageFile) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // We explicitly convert to WEBP for better compression, or JPEG if not supported.
      // WEBP compresses much better than JPEG in browser implementations.
      const mime = "image/webp"; 
      const dataUrl = canvas.toDataURL(mime, quality / 100);
      
      setCompressedSrc(dataUrl);

      // Calculate approximate size of base64
      // Base64 size = (string length * 3) / 4 - padding
      const decRatio = 0.75;
      const sizeInBytes = Math.round(dataUrl.length * decRatio - 2); 
      setCompressedSize(sizeInBytes);
    };
    img.src = origSrc;
  };

  // Debounce the slider compression slightly to avoid jank
  useEffect(() => {
    const t = setTimeout(() => {
      if (origSrc) compressImage();
    }, 200);
    return () => clearTimeout(t);
  }, [origSrc, quality]);

  const downloadCompressed = () => {
    if (!compressedSrc || !imageFile) return;

    const link = document.createElement("a");
    // Change extension to webp since we compress as webp
    const newName = imageFile.name.replace(/\.[^/.]+$/, "") + "-compressed.webp";
    
    link.download = newName;
    link.href = compressedSrc;
    link.click();
    toast.success("Compressed image downloaded!");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      
      {/* Upload/Preview Column */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="border-b bg-muted/20 p-4 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" /> Original Image
          </span>
          {origSrc && (
            <Button variant="ghost" size="sm" onClick={reset} className="h-8 gap-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" /> Reset
            </Button>
          )}
        </div>
        
        <CardContent className="p-6">
          {!origSrc ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault(); setIsDragging(false);
                if (e.dataTransfer.files?.length) processFile(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12 text-center cursor-pointer min-h-[350px] transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/30"
              )}
            >
              <div className="p-4 bg-muted rounded-full mb-4">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Upload or Drag Image</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Select an image file (PNG, JPG, WEBP) to compress.
              </p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-muted/20 checkerboard-bg rounded-xl border p-4 min-h-[350px]">
              <img 
                src={origSrc} 
                alt="Original" 
                className="max-w-full max-h-[300px] object-contain rounded-md shadow-sm"
              />
              <div className="mt-4 pt-4 border-t w-full flex justify-between items-center text-sm font-medium text-muted-foreground">
                <span>Original File</span>
                <span className="text-foreground">{formatBytes(imageFile?.size || 0)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings & Result Column */}
      <Card className="border-none shadow-sm relative overflow-hidden flex flex-col min-h-[425px]">
        <div className="border-b bg-muted/10 p-4 font-semibold text-muted-foreground">
          Compression Settings
        </div>
        <CardContent className="p-6 flex-1 flex flex-col justify-between">
          {!origSrc ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-8">
              <UploadCloud className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">Waiting for Image...</p>
              <p className="text-sm mt-2 opacity-70">Upload an image on the left to see compression options.</p>
            </div>
          ) : (
            <div className="space-y-8 flex-1 flex flex-col">
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Image Quality Slider</Label>
                  <span className="font-mono text-sm font-bold text-primary">{quality}%</span>
                </div>
                <p className="text-sm text-muted-foreground">Lower quality yields smaller file sizes but introduces compression artifacts.</p>
                <Slider
                  min={1} max={100} step={1}
                  value={[quality]}
                  onValueChange={(v) => setQuality(v[0])}
                  className="py-4"
                />
              </div>

              <div className="p-6 border rounded-xl bg-card relative overflow-hidden group">
                {/* Visual diffing effect background */}
                <div 
                  className="absolute inset-0 bg-green-500/5 transition-opacity" 
                  style={{ opacity: `${(100 - quality) / 100}` }}
                />
                
                <h4 className="font-semibold mb-4 relative z-10 flex items-center justify-between">
                  Compression Results
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-full">
                    - {imageFile?.size ? Math.max(0, Math.round(100 - (compressedSize / imageFile.size) * 100)) : 0}% Smaller
                  </span>
                </h4>
                
                <div className="flex items-center justify-between gap-4 relative z-10">
                  <div className="text-center p-4 bg-background border rounded-lg flex-1">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Old Size</div>
                    <div className="text-xl font-bold font-mono">{formatBytes(imageFile?.size || 0)}</div>
                  </div>
                  
                  <div className="text-muted-foreground">
                    <ArrowRight className="h-6 w-6" />
                  </div>

                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg flex-1">
                    <div className="text-xs text-green-600 dark:text-green-500 uppercase tracking-wider font-semibold mb-1">New Size</div>
                    <div className="text-xl font-bold font-mono text-green-700 dark:text-green-400">{formatBytes(compressedSize)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t">
                <Button 
                  onClick={downloadCompressed} 
                  size="lg"
                  className="w-full gap-2 font-semibold text-base h-14"
                  disabled={!compressedSrc}
                >
                  <Download className="h-5 w-5" /> Download Compressed Image
                </Button>
              </div>

              {/* Hidden canvas for processing */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
