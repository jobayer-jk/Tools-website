"use client";

import { useState, useRef, ChangeEvent } from "react";
import { UploadCloud, Copy, RefreshCcw, Image as ImageIcon, ExternalLink } from "lucide-react";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function QrReaderClient() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (file: File) => {
    // Only accept images
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      
      // We need to draw the image to a canvas to get its ImageData for jsQR
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          toast.error("Failed to initialize canvas for reading.");
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          setResult(code.data);
          toast.success("QR Code successfully decoded!");
        } else {
          setResult(null);
          toast.error("No QR Code found in this image. Please try a clearer picture.");
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImage(e.target.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImage(e.dataTransfer.files[0]);
    }
  };

  const reset = () => {
    setImageSrc(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      toast.success("Result copied to clipboard!");
    } catch {
      toast.error("Failed to copy text.");
    }
  };

  const openLink = () => {
    if (result && (result.startsWith("http://") || result.startsWith("https://"))) {
      window.open(result, "_blank");
    }
  };

  const isLink = result && (result.startsWith("http://") || result.startsWith("https://"));

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Upload Column */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="border-b bg-muted/20 p-4 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" /> Image Upload
          </span>
          {imageSrc && (
            <Button variant="ghost" size="sm" onClick={reset} className="h-8 gap-2 text-muted-foreground">
              <RefreshCcw className="h-4 w-4" /> Reset
            </Button>
          )}
        </div>
        <CardContent className="p-6">
          {!imageSrc ? (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12 text-center cursor-pointer min-h-[400px] transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/30"
              )}
            >
              <div className="p-4 bg-muted rounded-full mb-4">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Upload or Drag Image</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Select an image file (PNG, JPG, WEBP) from your device to scan for QR codes.
              </p>
              <Button variant="secondary" className="mt-6 pointer-events-none">
                Browse Files
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-muted/20 checkerboard-bg rounded-xl border p-4 min-h-[400px]">
              <img 
                src={imageSrc} 
                alt="Uploaded for QR scanning" 
                className="max-w-full max-h-[350px] object-contain rounded-md shadow-sm"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Column */}
      <Card className="border-none shadow-sm relative overflow-hidden flex flex-col min-h-[475px]">
        <div className="border-b bg-muted/10 p-4 font-semibold text-muted-foreground">
          Scan Result
        </div>
        <CardContent className="p-6 flex-1 flex flex-col justify-center">
          {imageSrc && !result ? (
            <div className="text-center px-4 space-y-4">
              <div className="inline-flex p-4 bg-destructive/10 text-destructive rounded-full">
                <ImageIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-destructive">No QR Code Found</h3>
              <p className="text-muted-foreground text-sm">
                We couldn't detect a valid QR code in the uploaded image. Try uploading a clearer, higher-resolution picture.
              </p>
              <Button onClick={reset} variant="outline" className="mt-4">Try Another Image</Button>
            </div>
          ) : result ? (
            <div className="space-y-6 flex-1 flex flex-col">
              <div className="space-y-2 flex-1">
                <Label className="text-green-600 dark:text-green-500 font-bold flex items-center gap-2 text-lg mb-4">
                  Successfully Decoded Data:
                </Label>
                <Textarea 
                  readOnly 
                  value={result} 
                  className="min-h-[250px] font-mono text-base resize-y p-6 bg-green-500/5 border-green-500/20 focus-visible:ring-green-500/50"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                <Button onClick={copyResult} variant="secondary" size="lg" className="w-full gap-2 font-semibold">
                  <Copy className="h-5 w-5" /> Copy Text
                </Button>
                {isLink && (
                  <Button onClick={openLink} variant="default" size="lg" className="w-full gap-2 font-semibold">
                    <ExternalLink className="h-5 w-5" /> Open Link
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground px-8 flex flex-col items-center">
              <UploadCloud className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">Waiting for Image...</p>
              <p className="text-sm mt-2 opacity-70">Upload an image on the left to extract its data here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
