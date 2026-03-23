"use client";

import { useState, useRef, ChangeEvent } from "react";
import { UploadCloud, Copy, Image as ImageIcon, Trash2, Cpu, ScanText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Tesseract from "tesseract.js";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function TextExtractorClient() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [progressVal, setProgressVal] = useState(0);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setExtractedText(null);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
  };

  const clearAll = () => {
    setImageFile(null);
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setExtractedText(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const executeExtraction = async () => {
    if (!imageSrc) return;

    try {
      setIsProcessing(true);
      setProgressMsg("Initializing OCR Engine...");
      setProgressVal(10);

      const result = await Tesseract.recognize(
        imageSrc,
        "eng",
        {
          logger: m => {
            if (m.status === "recognizing text") {
              setProgressMsg("Reading text from image...");
              setProgressVal(Math.round(m.progress * 100));
            } else {
              setProgressMsg(m.status);
            }
          }
        }
      );

      setExtractedText(result.data.text);
      toast.success("Text extracted successfully!");

    } catch (error) {
      console.error(error);
      toast.error("OCR processing failed. The image might be unreadable.");
    } finally {
      setIsProcessing(false);
      setProgressMsg("");
      setProgressVal(0);
    }
  };

  const copyToClipboard = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy text.");
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      
      {/* Upload Column */}
      <Card className="border-none shadow-sm overflow-hidden flex flex-col min-h-[450px]">
        <div className="border-b bg-muted/20 p-4 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ScanText className="h-5 w-5 text-primary" /> Source Image
          </span>
          {imageSrc && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 gap-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" /> Reset
            </Button>
          )}
        </div>
        
        <CardContent className="p-6 flex-1 flex flex-col justify-center">
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
                "border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12 text-center cursor-pointer min-h-[350px] transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/30",
                isProcessing && "opacity-50 pointer-events-none"
              )}
            >
              <div className="p-4 bg-muted rounded-full mb-4">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Upload Document</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Select an image containing text (receipts, pages, screens) to scan.
              </p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>
          ) : (
             <div className="flex flex-col items-center justify-between w-full min-h-[350px]">
               <div className="w-full flex-1 bg-black/5 rounded-xl border flex flex-col items-center justify-center p-2 mb-4 overflow-hidden">
                 <img 
                   src={imageSrc} 
                   alt="Source Document" 
                   className="max-h-[300px] w-auto max-w-full rounded-md shadow-sm"
                 />
               </div>
               
               {!extractedText && !isProcessing && (
                  <Button onClick={executeExtraction} size="lg" className="w-full text-lg h-14 font-bold gap-2">
                     <ScanText className="h-5 w-5" /> Run OCR Scanner
                  </Button>
               )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Column */}
      <Card className="border-none shadow-sm relative overflow-hidden flex flex-col min-h-[450px]">
        <div className="border-b bg-muted/10 p-4 font-semibold text-muted-foreground flex items-center justify-between">
           <span>Extracted Text Output</span>
        </div>
        
        <CardContent className="p-0 flex-1 flex flex-col">
          {!imageSrc ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-8 bg-muted/5 min-h-[300px]">
              <ScanText className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">Capture Readout</p>
              <p className="text-sm mt-2 opacity-70">Upload an image and run the scanner to see extracted text here.</p>
            </div>
          ) : isProcessing ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/5 min-h-[350px]">
                <Cpu className="h-16 w-16 text-primary animate-pulse mb-6" />
                <div className="w-full max-w-xs space-y-2">
                   <div className="flex justify-between text-sm font-bold">
                     <span className="truncate">{progressMsg}</span>
                     <span>{progressVal}%</span>
                   </div>
                   <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                     <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressVal}%` }} />
                   </div>
                </div>
             </div>
          ) : extractedText !== null && (
             <div className="flex-1 flex flex-col items-center justify-between p-6 bg-muted/5 min-h-[350px]">
                <Textarea 
                  value={extractedText} 
                  readOnly 
                  className="flex-1 w-full min-h-[300px] resize-none font-mono text-sm leading-relaxed p-4 bg-background"
                />
                
                <div className="w-full mt-6 pt-6 border-t flex gap-4">
                  <Button 
                    onClick={copyToClipboard} 
                    size="lg"
                    variant={copied ? "default" : "secondary"}
                    className={cn("flex-1 gap-2 font-semibold text-base h-14", copied && "bg-emerald-500 hover:bg-emerald-600 text-white")}
                  >
                    {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />} 
                    {copied ? "Copied!" : "Copy to Clipboard"}
                  </Button>
                </div>
             </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
