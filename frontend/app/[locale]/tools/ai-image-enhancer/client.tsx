"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { UploadCloud, Download, Image as ImageIcon, Trash2, SlidersHorizontal, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function ImageEnhancerClient() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  
  // Filter States
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [blur, setBlur] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    resetFilters();
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSepia(0);
    setBlur(0);
    setHueRotate(0);
  };

  const clearAll = () => {
    setImageFile(null);
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    resetFilters();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Generate CSS filter string
  const getFilterString = () => {
    return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) blur(${blur}px) hue-rotate(${hueRotate}deg)`;
  };

  const downloadImage = () => {
    if (!imageSrc || !imageRef.current || !canvasRef.current || !imageFile) return;

    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions strictly to original image internal dimensions
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Apply exact filter scaling equivalent to CSS
    // Blur needs to be scaled proportionally if natural dimensions are larger than preview
    const scaleY = img.naturalHeight / img.clientHeight;
    const scaledBlur = blur * scaleY;

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) blur(${scaledBlur}px) hue-rotate(${hueRotate}deg)`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const url = canvas.toDataURL("image/jpeg", 0.95);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${imageFile.name.replace(/\.[^/.]+$/, "")}-enhanced.jpg`;
    link.click();
    toast.success("Enhanced image downloaded!");
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      
      {/* Editor Column */}
      <Card className="lg:col-span-8 border-none shadow-sm relative overflow-hidden flex flex-col min-h-[500px]">
        <div className="border-b bg-muted/10 p-4 font-semibold text-muted-foreground flex items-center justify-between">
           <span className="flex items-center gap-2">
             <ImageIcon className="h-5 w-5 text-primary" /> Visual Sandbox
           </span>
           {imageFile && (
             <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 gap-2 text-muted-foreground hover:text-destructive">
               <Trash2 className="h-4 w-4" /> Reset
             </Button>
           )}
        </div>
        
        <CardContent className="p-0 flex-1 flex flex-col">
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
                "flex-1 flex flex-col items-center justify-center p-12 text-center cursor-pointer transition-colors m-8 border-2 border-dashed rounded-xl bg-muted/5 min-h-[400px]",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/30"
              )}
            >
              <div className="p-4 bg-muted rounded-full mb-4">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Upload Canvas</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Drag & drop or load an image to apply filters.
              </p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/5 min-h-[450px]">
                <div className="checkerboard-bg p-2 border shadow-inner rounded-xl overflow-hidden flex items-center justify-center">
                  <img 
                    ref={imageRef}
                    src={imageSrc} 
                    alt="Enhanced Result" 
                    className="max-h-[500px] w-auto transition-all"
                    style={{ filter: getFilterString() }}
                    crossOrigin="anonymous"
                  />
                  {/* Hidden canvas for off-screen rendering */}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                
                <div className="w-full mt-8 flex px-4">
                  <Button 
                    onClick={downloadImage} 
                    size="lg"
                    className="w-full gap-2 font-bold text-base h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Download className="h-5 w-5" /> Download Beautiful Edit
                  </Button>
                </div>
             </div>
          )}
        </CardContent>
      </Card>

      {/* Adjustments Toolbelt Column */}
      <Card className="lg:col-span-4 border-none shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="border-b bg-muted/20 p-4 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" /> Adjustments
          </span>
          {imageSrc && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 gap-2 text-muted-foreground">
              <Settings2 className="h-4 w-4" /> Default
            </Button>
          )}
        </div>
        
        <CardContent className="p-6 flex-1 flex flex-col space-y-8 overflow-y-auto custom-scrollbar">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Brightness</Label>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">{brightness}%</span>
            </div>
            <Slider 
              value={[brightness]} 
              onValueChange={(v) => setBrightness(v[0])} 
              max={200} min={0} step={1}
              disabled={!imageSrc}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Contrast</Label>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">{contrast}%</span>
            </div>
            <Slider 
              value={[contrast]} 
              onValueChange={(v) => setContrast(v[0])} 
              max={200} min={0} step={1}
              disabled={!imageSrc}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Saturation</Label>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">{saturation}%</span>
            </div>
            <Slider 
              value={[saturation]} 
              onValueChange={(v) => setSaturation(v[0])} 
              max={200} min={0} step={1}
              disabled={!imageSrc}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Sepia</Label>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">{sepia}%</span>
            </div>
            <Slider 
              value={[sepia]} 
              onValueChange={(v) => setSepia(v[0])} 
              max={100} min={0} step={1}
              disabled={!imageSrc}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Hue Rotate</Label>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">{hueRotate}°</span>
            </div>
            <Slider 
              value={[hueRotate]} 
              onValueChange={(v) => setHueRotate(v[0])} 
              max={360} min={0} step={1}
              disabled={!imageSrc}
            />
          </div>

          <div className="space-y-4 pb-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Blur</Label>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">{blur}px</span>
            </div>
            <Slider 
              value={[blur]} 
              onValueChange={(v) => setBlur(v[0])} 
              max={20} min={0} step={1}
              disabled={!imageSrc}
            />
          </div>

        </CardContent>
      </Card>
      
    </div>
  );
}
