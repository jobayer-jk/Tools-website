"use client";

import { useState, useRef, ChangeEvent } from "react";
import { UploadCloud, Download, Image as ImageIcon, Trash2, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mapping extensions to proper mime types
const FORMATS = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
  bmp: "image/bmp"
};

type OutFormat = keyof typeof FORMATS;

export function ImageConverterClient() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [origSrc, setOrigSrc] = useState<string | null>(null);
  
  const [outputFormat, setOutputFormat] = useState<OutFormat>("webp");
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
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
  };

  const reset = () => {
    setImageFile(null);
    setOrigSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadConverted = () => {
    if (!origSrc || !imageFile) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      
      // Fill background white for jpeg/bmp transparency handling
      if (outputFormat === "jpeg" || outputFormat === "bmp") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const mime = FORMATS[outputFormat];
      const dataUrl = canvas.toDataURL(mime, 0.95);
      
      const link = document.createElement("a");
      // Change extension securely
      const baseName = imageFile.name.replace(/\.[^/.]+$/, "");
      link.download = `${baseName}.${outputFormat === "jpeg" ? "jpg" : outputFormat}`;
      link.href = dataUrl;
      link.click();
      toast.success(`Converted to ${outputFormat.toUpperCase()} and downloaded!`);
    };
    img.src = origSrc;
  };

  // Determine original extension
  const getOriginalExt = () => {
    if (!imageFile) return "???";
    const match = imageFile.type.match(/image\/(jpeg|png|webp|bmp|gif)/i);
    return match ? match[1].toUpperCase() : "IMG";
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      
      {/* Upload/Preview Column */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="border-b bg-muted/20 p-4 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" /> Source Image
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
                Select an image file to convert its format.
              </p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-muted/20 checkerboard-bg rounded-xl border p-4 min-h-[350px]">
              <img 
                src={origSrc} 
                alt="Source" 
                className="max-w-full max-h-[300px] object-contain rounded-md shadow-sm"
              />
              <div className="mt-4 pt-4 border-t w-full flex justify-between items-center text-sm font-medium text-muted-foreground">
                <span>File: {imageFile?.name}</span>
                <span className="uppercase text-foreground font-bold">{getOriginalExt()}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Column */}
      <Card className="border-none shadow-sm relative overflow-hidden flex flex-col min-h-[425px]">
        <div className="border-b bg-muted/10 p-4 font-semibold text-muted-foreground">
          Conversion Output
        </div>
        <CardContent className="p-6 flex-1 flex flex-col justify-between">
          {!origSrc ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-8">
              <UploadCloud className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">Waiting for Image...</p>
              <p className="text-sm mt-2 opacity-70">Upload an image on the left to set the output format.</p>
            </div>
          ) : (
            <div className="space-y-8 flex-1 flex flex-col">
              
              <div className="p-8 border-2 border-dashed bg-muted/10 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
                <ArrowRightLeft className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-xl font-bold">Select Target Format</h3>
                <p className="text-sm text-muted-foreground px-4">
                   Your browser will instantly redraw the image into the selected codec.
                </p>
              </div>

              <div className="space-y-4 pt-2 max-w-[300px] mx-auto w-full">
                <Label className="text-base font-semibold">Convert To</Label>
                <Select value={outputFormat} onValueChange={(v) => setOutputFormat(v as OutFormat)}>
                  <SelectTrigger className="h-14 bg-background font-bold text-lg uppercase tracking-wider text-center">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webp" className="font-bold uppercase tracking-wider">WEBP</SelectItem>
                    <SelectItem value="png" className="font-bold uppercase tracking-wider">PNG</SelectItem>
                    <SelectItem value="jpeg" className="font-bold uppercase tracking-wider">JPG</SelectItem>
                    <SelectItem value="bmp" className="font-bold uppercase tracking-wider">BMP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-auto pt-6 border-t">
                <Button 
                  onClick={downloadConverted} 
                  size="lg"
                  className="w-full gap-2 font-semibold text-base h-14 bg-primary hover:bg-primary/90"
                >
                  <Download className="h-5 w-5" /> Download as {outputFormat.toUpperCase()}
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
