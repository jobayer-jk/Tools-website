"use client";

import { useState, useRef, ChangeEvent } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { UploadCloud, Download, Image as ImageIcon, Trash2, Crop as CropIcon } from "lucide-react";
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

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

export function ImageCropperClient() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [origSrc, setOrigSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    setImageFile(file);
    const url = URL.createObjectURL(file);
    
    // Reset state for new image
    setCrop(undefined);
    setCompletedCrop(undefined);
    setAspect(undefined);
    
    setOrigSrc(url);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
  };

  const reset = () => {
    setImageFile(null);
    setOrigSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAspectChange = (val: string) => {
    let newAspect: number | undefined;
    if (val === "free") newAspect = undefined;
    else if (val === "1:1") newAspect = 1;
    else if (val === "16:9") newAspect = 16 / 9;
    else if (val === "4:3") newAspect = 4 / 3;
    else if (val === "3:2") newAspect = 3 / 2;

    setAspect(newAspect);

    if (imgRef.current && newAspect) {
      setCrop(centerAspectCrop(imgRef.current.width, imgRef.current.height, newAspect));
    } else {
      setCrop(undefined);
    }
  };

  const downloadCropped = () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current || !imageFile) {
      toast.error("Please draw a crop area first.");
      return;
    }

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const cropArea = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Use higher pixel ratio for sharp retina canvas draws
    const pixelRatio = window.devicePixelRatio;
    canvas.width = Math.floor(cropArea.width * scaleX * pixelRatio);
    canvas.height = Math.floor(cropArea.height * scaleY * pixelRatio);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      toast.error("Failed to acquire canvas context");
      return;
    }

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    const cropX = cropArea.x * scaleX;
    const cropY = cropArea.y * scaleY;
    const cropWidth = cropArea.width * scaleX;
    const cropHeight = cropArea.height * scaleY;

    // Draw the natural size image offset and cropped
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    // Provide a file named like the original but with -cropped segment
    const mime = imageFile.type || "image/png";
    const dataUrl = canvas.toDataURL(mime, 1.0);
    const downloadLink = document.createElement("a");
    const newName = imageFile.name.replace(/\.[^/.]+$/, "") + "-cropped.png";
    downloadLink.download = newName;
    downloadLink.href = dataUrl;
    downloadLink.click();
    toast.success("Cropped image downloaded!");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      
      {/* Upload/Crop Area Column */}
      <Card className="border-none shadow-sm overflow-hidden flex flex-col">
        <div className="border-b bg-muted/20 p-4 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CropIcon className="h-5 w-5 text-primary" /> Cropping Canvas
          </span>
          {origSrc && (
            <Button variant="ghost" size="sm" onClick={reset} className="h-8 gap-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" /> Reset
            </Button>
          )}
        </div>
        
        <CardContent className="p-6 flex-1 flex flex-col justify-center bg-muted/10 checkerboard-bg min-h-[450px]">
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
                "border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12 text-center cursor-pointer min-h-[350px] transition-colors bg-white/50",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/30"
              )}
            >
              <div className="p-4 bg-muted rounded-full mb-4">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Upload Image to Crop</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Drag & drop or click to select an image from your device.
              </p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <p className="w-full text-center text-sm font-medium text-muted-foreground bg-background/80 p-2 border rounded border-b-0 rounded-b-none z-10 sticky top-0 backdrop-blur">
                Draw a box on the image below to select crop area
              </p>
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                className="max-h-[500px] shadow-2xl rounded-md overflow-hidden bg-black/5"
              >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={origSrc}
                  onLoad={onImageLoad}
                  className="max-h-[500px] w-auto pointer-events-none"
                />
              </ReactCrop>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Column */}
      <Card className="border-none shadow-sm relative overflow-hidden flex flex-col min-h-[450px]">
        <div className="border-b bg-muted/10 p-4 font-semibold text-muted-foreground">
          Crop Settings
        </div>
        <CardContent className="p-6 flex-1 flex flex-col">
          {!origSrc ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-8">
              <UploadCloud className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">Waiting for Image...</p>
              <p className="text-sm mt-2 opacity-70">Upload an image on the left to activate settings.</p>
            </div>
          ) : (
            <div className="space-y-8 flex-1 flex flex-col">
              
              <div className="space-y-4 pt-2">
                <Label className="text-base font-semibold">Aspect Ratio Lock</Label>
                <Select defaultValue="free" onValueChange={handleAspectChange}>
                  <SelectTrigger className="h-12 bg-background font-medium">
                    <SelectValue placeholder="Select Ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Freeform (No Lock)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square for Instagram etc.)</SelectItem>
                    <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                    <SelectItem value="4:3">4:3 (Standard Photo)</SelectItem>
                    <SelectItem value="3:2">3:2 (Classic Frame)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground pt-1">Selecting a ratio locks the crop box proportions automatically.</p>
              </div>

              <div className="flex-1 min-h-[100px] flex items-center justify-center border-dashed border-2 rounded-xl bg-muted/5">
                 <div className="text-center p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2">Crop Area Target Dimensions</div>
                  {completedCrop && imgRef.current ? (
                    <div className="text-2xl font-bold font-mono">
                      {Math.round(completedCrop.width * (imgRef.current.naturalWidth / imgRef.current.width))} 
                      <span className="text-muted-foreground mx-2">×</span> 
                      {Math.round(completedCrop.height * (imgRef.current.naturalHeight / imgRef.current.height))} px
                    </div>
                  ) : (
                    <div className="text-lg text-muted-foreground/70">No area selected</div>
                  )}
                 </div>
              </div>

              <div className="mt-auto pt-6 border-t">
                <Button 
                  onClick={downloadCropped} 
                  size="lg"
                  className="w-full gap-2 font-semibold text-base h-14"
                  disabled={!completedCrop || completedCrop.width === 0}
                >
                  <Download className="h-5 w-5" /> Download Cropped Image
                </Button>
              </div>

              {/* Hidden canvas for exact crop drawing */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
