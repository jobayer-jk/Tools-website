"use client";

import { useState, useRef, ChangeEvent } from "react";
import { UploadCloud, Download, FileText, Trash2, ArrowUp, ArrowDown, Image as ImageIcon } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImgFile {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function ImageToPdfClient() {
  const [images, setImages] = useState<ImgFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | File[]) => {
    // pdf-lib supports PNG and JPEG directly
    const validImages = Array.from(files).filter(f => 
      f.type === "image/jpeg" || f.type === "image/png"
    );
    
    if (validImages.length !== files.length) {
      toast.error("Only JPG and PNG files are supported natively by our PDF engine currently.");
    }

    if (validImages.length > 0) {
      const newFiles = validImages.map(f => ({
        id: Math.random().toString(36).substring(7),
        file: f,
        name: f.name,
        size: f.size,
        previewUrl: URL.createObjectURL(f)
      }));
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFiles(e.target.files);
  };

  const removeFile = (id: string, previewUrl: string) => {
    URL.revokeObjectURL(previewUrl);
    setImages(prev => prev.filter(f => f.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const items = [...images];
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    setImages(items);
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    const items = [...images];
    [items[index + 1], items[index]] = [items[index], items[index + 1]];
    setImages(items);
  };

  const clearAll = () => {
    images.forEach(i => URL.revokeObjectURL(i.previewUrl));
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;

    try {
      setIsConverting(true);
      
      const pdfDoc = await PDFDocument.create();

      for (const imgItem of images) {
        const arrayBuffer = await imgItem.file.arrayBuffer();
        
        let pdfImage;
        if (imgItem.file.type === "image/jpeg") {
          pdfImage = await pdfDoc.embedJpg(arrayBuffer);
        } else if (imgItem.file.type === "image/png") {
          pdfImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          continue;
        }

        const dims = pdfImage.scale(1.0);
        // Add a page that matches exactly the image dimensions
        const page = pdfDoc.addPage([dims.width, dims.height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: dims.width,
          height: dims.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `images-converted.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success("Images converted to PDF successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to convert images to PDF.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      
      {/* Upload Column */}
      <Card className="lg:col-span-4 border-none shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="border-b bg-muted/20 p-4 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" /> Add JPG/PNG
          </span>
          {images.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 gap-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" /> Clear All
            </Button>
          )}
        </div>
        
        <CardContent className="p-6 flex-1 flex flex-col justify-center">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault(); setIsDragging(false);
              if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center cursor-pointer min-h-[300px] transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/30",
              images.length > 0 && "min-h-[200px]"
            )}
          >
            <div className="p-4 bg-muted rounded-full mb-4">
              <UploadCloud className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Upload Images</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Drag & drop or click to select multiple JPG/PNG files to merge into a single PDF.
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/jpeg, image/png" 
              className="hidden" 
              multiple 
            />
          </div>
        </CardContent>
      </Card>

      {/* Pages Order Column */}
      <Card className="lg:col-span-8 border-none shadow-sm relative overflow-hidden flex flex-col min-h-[400px]">
        <div className="border-b bg-muted/10 p-4 font-semibold text-muted-foreground flex items-center justify-between">
          <span>Arrange Pages ({images.length} images)</span>
          {images.length > 0 && (
            <Button 
              onClick={convertToPdf} 
              size="sm"
              disabled={isConverting}
              className="gap-2 font-semibold bg-primary hover:bg-primary/90"
            >
              <Download className="h-4 w-4" /> {isConverting ? "Converting..." : "Convert to PDF"}
            </Button>
          )}
        </div>
        
        <CardContent className="p-0 flex-1 flex flex-col">
          {images.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-8 bg-muted/5 min-h-[300px]">
              <ImageIcon className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">No Images Added Yet</p>
              <p className="text-sm mt-2 opacity-70">Add JPG or PNG images to create your multi-page PDF.</p>
            </div>
          ) : (
            <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar grid sm:grid-cols-2 gap-4">
              {images.map((img, index) => (
                <div key={img.id} className="flex items-center justify-between p-3 border rounded-lg bg-card shadow-sm hover:border-primary/50 transition-colors group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={img.previewUrl} alt="preview" className="h-12 w-12 object-cover rounded bg-muted checkerboard-bg" />
                    <div className="truncate">
                      <p className="text-sm font-semibold truncate max-w-[120px]">{img.name}</p>
                      <p className="text-xs text-muted-foreground">{formatBytes(img.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="flex flex-col">
                      <Button variant="ghost" size="icon" onClick={() => moveUp(index)} disabled={index === 0} className="h-6 w-6 text-muted-foreground hover:text-foreground">
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => moveDown(index)} disabled={index === images.length - 1} className="h-6 w-6 text-muted-foreground hover:text-foreground">
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="w-px h-8 bg-border mx-1" />
                    <Button variant="ghost" size="icon" onClick={() => removeFile(img.id, img.previewUrl)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
        </CardContent>
      </Card>
      
    </div>
  );
}
