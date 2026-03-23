"use client";

import { useState, useRef, ChangeEvent } from "react";
import { UploadCloud, Download, Image as ImageIcon, Lock, Unlock, Trash2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ImageResizerClient() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);

  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");

  const [keepAspect, setKeepAspect] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImageSrc(url);

    const img = new Image();
    img.onload = () => {
      setOrigW(img.width);
      setOrigH(img.height);
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = url;
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleWidthChange = (val: string) => {
    const nw = parseInt(val);
    setWidth(val === "" ? "" : isNaN(nw) ? "" : nw);

    if (keepAspect && !isNaN(nw) && origW > 0) {
      const ratio = origH / origW;
      setHeight(Math.round(nw * ratio));
    }
  };

  const handleHeightChange = (val: string) => {
    const nh = parseInt(val);
    setHeight(val === "" ? "" : isNaN(nh) ? "" : nh);

    if (keepAspect && !isNaN(nh) && origH > 0) {
      const ratio = origW / origH;
      setWidth(Math.round(nh * ratio));
    }
  };

  const toggleAspect = () => {
    setKeepAspect(!keepAspect);
    // If turning ON, reset to original ratio based on current width
    if (!keepAspect && typeof width === "number" && origW > 0) {
      const ratio = origH / origW;
      setHeight(Math.round(width * ratio));
    }
  };

  const reset = () => {
    setImageFile(null);
    setImageSrc(null);
    setWidth("");
    setHeight("");
    setOrigW(0);
    setOrigH(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadResized = () => {
    if (!imageSrc || !width || !height || !imageFile) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = Number(width);
      canvas.height = Number(height);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Keep original mime type
      const mime = imageFile.type || "image/png";
      const dataUrl = canvas.toDataURL(mime, 1.0);

      const link = document.createElement("a");
      link.download = `resized-${width}x${height}-${imageFile.name}`;
      link.href = dataUrl;
      link.click();
      toast.success("Resized image downloaded!");
    };
    img.src = imageSrc;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">

      {/* Upload Column */}
      <Card className="border-none shadow-md bg-muted/20 overflow-hidden">
        <div className="bg-muted p-4 font-semibold flex items-center justify-between rounded-t-xl">
          <span className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" /> Image Upload
          </span>
          {imageSrc && (
            <Button variant="ghost" size="sm" onClick={reset} className="h-8 gap-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" /> Reset
            </Button>
          )}
        </div>
        <CardContent className="p-6">
          {!imageSrc ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault(); setIsDragging(false);
                if (e.dataTransfer.files?.length) processFile(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "rounded-xl flex flex-col items-center justify-center p-12 text-center cursor-pointer min-h-[350px] transition-colors bg-muted/60",
                isDragging ? "bg-primary/10" : "hover:bg-muted"
              )}
            >
              <div className="p-4 bg-muted rounded-full mb-4">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Upload or Drag Image</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Select an image file (PNG, JPG, WEBP) to resize.
              </p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-muted/60 checkerboard-bg rounded-xl p-4 min-h-[350px]">
              <img
                src={imageSrc}
                alt="Original"
                className="max-w-full max-h-[300px] object-contain rounded-md shadow-sm"
              />
              <div className="mt-4 pt-4 w-full text-center text-sm font-medium text-muted-foreground">
                Original Size: {origW} × {origH} px
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Column */}
      <Card className="border-none shadow-sm bg-muted/20 relative overflow-hidden flex flex-col min-h-[425px]">
        <div className="bg-muted p-4 font-semibold text-muted-foreground rounded-t-xl">
          Resize Settings
        </div>
        <CardContent className="p-6 flex-1 flex flex-col">
          {!imageSrc ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-8">
              <UploadCloud className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">Waiting for Image...</p>
              <p className="text-sm mt-2 opacity-70">Upload an image on the left to set its new dimensions.</p>
            </div>
          ) : (
            <div className="space-y-8 flex-1 flex flex-col">

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <Label htmlFor="aspect-toggle" className="flex items-center gap-2 cursor-pointer font-semibold">
                  {keepAspect ? <Lock className="h-4 w-4 text-primary" /> : <Unlock className="h-4 w-4 text-muted-foreground" />}
                  Lock Aspect Ratio
                </Label>
                <Switch id="aspect-toggle" checked={keepAspect} onCheckedChange={toggleAspect} />
              </div>

              <div className="grid grid-cols-2 gap-6 relative">
                {/* Visual link line if aspect ratio locked */}
                {keepAspect && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-8 border-t-2 border-b-2 border-l-2 border-primary/40 rounded-l-lg pointer-events-none" />
                )}

                <div className="space-y-3 z-10 bg-transparent">
                  <Label className="font-semibold text-sm">Width (px)</Label>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="h-12 text-lg font-mono font-bold border-none shadow-sm bg-muted focus-visible:ring-1"
                  />
                </div>

                <div className="space-y-3 z-10 bg-transparent">
                  <Label className="font-semibold text-sm">Height (px)</Label>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="h-12 text-lg font-mono font-bold border-none shadow-sm bg-muted focus-visible:ring-1"
                  />
                </div>
              </div>

              <div className="mt-auto pt-6 flex flex-col gap-4">
                <Button
                  onClick={() => {
                    setWidth(origW);
                    setHeight(origH);
                  }}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <RefreshCcw className="h-4 w-4" /> Reset to Original Size
                </Button>

                <Button
                  onClick={downloadResized}
                  size="lg"
                  className="w-full gap-2 font-semibold text-base h-14"
                  disabled={!width || !height}
                >
                  <Download className="h-5 w-5" /> Download Resized Image
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
