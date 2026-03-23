"use client";

import { useState, useRef, ChangeEvent } from "react";
import { UploadCloud, Copy, Image as ImageIcon, Trash2, Check, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export function ImageToBase64Client() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [templateType, setTemplateType] = useState<"raw" | "html" | "css">("raw");
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    setImageFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setBase64(b64);
      toast.success("Image converted to Base64!");
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
  };

  const reset = () => {
    setImageFile(null);
    setBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formattedOutput = () => {
    if (!base64) return "";
    switch(templateType) {
      case "html": return `<img src="${base64}" alt="Base64 Image" />`;
      case "css": return `background-image: url('${base64}');`;
      case "raw": default: return base64;
    }
  };

  const copyToClipboard = async () => {
    const text = formattedOutput();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy text.");
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      
      {/* Upload Column */}
      <Card className="border-none shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="border-b bg-muted/20 p-4 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" /> Source Image
          </span>
          {base64 && (
            <Button variant="ghost" size="sm" onClick={reset} className="h-8 gap-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" /> Reset
            </Button>
          )}
        </div>
        
        <CardContent className="p-6 flex-1 flex flex-col justify-center">
          {!base64 ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault(); setIsDragging(false);
                if (e.dataTransfer.files?.length) processFile(e.dataTransfer.files[0]);
              }}
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
                Select an image file to extract its Base64 encoding.
              </p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-muted/20 checkerboard-bg rounded-xl border p-4 min-h-[400px]">
              <img 
                src={base64} 
                alt="Source" 
                className="max-w-full max-h-[350px] object-contain rounded-md shadow-sm"
              />
              <div className="mt-4 pt-4 border-t w-full flex justify-between items-center text-sm font-medium text-muted-foreground">
                <span className="truncate max-w-[200px]">{imageFile?.name}</span>
                <span className="font-mono text-primary text-xs bg-primary/10 px-2 py-1 rounded">
                  {Math.round(base64.length / 1024)} KB String
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Column */}
      <Card className="border-none shadow-sm relative overflow-hidden flex flex-col min-h-[500px]">
        <div className="border-b bg-muted/10 p-4 font-semibold text-muted-foreground flex items-center justify-between">
          Base64 Output String
        </div>
        
        <CardContent className="p-0 flex-1 flex flex-col">
          {!base64 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-8 bg-muted/5">
              <FileCode2 className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">No Data Available</p>
              <p className="text-sm mt-2 opacity-70">Upload an image on the left to see the generated string here.</p>
            </div>
          ) : (
            <>
              {/* Type formatting tabs */}
              <div className="flex w-full bg-muted/30 p-2 gap-2 border-b">
                <Button 
                  onClick={() => setTemplateType("raw")} 
                  variant={templateType === "raw" ? "default" : "ghost"} 
                  size="sm" 
                  className="flex-1 rounded-sm h-8"
                >
                  Raw String
                </Button>
                <Button 
                  onClick={() => setTemplateType("html")} 
                  variant={templateType === "html" ? "default" : "ghost"} 
                  size="sm" 
                  className="flex-1 rounded-sm h-8"
                >
                  HTML &lt;img&gt;
                </Button>
                <Button 
                  onClick={() => setTemplateType("css")} 
                  variant={templateType === "css" ? "default" : "ghost"} 
                  size="sm" 
                  className="flex-1 rounded-sm h-8"
                >
                  CSS Background
                </Button>
              </div>

              {/* Text Area */}
              <Textarea 
                readOnly
                value={formattedOutput()}
                className="flex-1 resize-none border-0 rounded-none bg-transparent font-mono text-xs sm:text-sm p-4 sm:p-6 focus-visible:ring-0 break-all leading-snug custom-scrollbar"
                placeholder="String will appear here..."
              />
              
              <div className="p-4 border-t bg-card mt-auto">
                <Button 
                  onClick={copyToClipboard} 
                  size="lg"
                  className="w-full gap-2 font-semibold text-base h-12"
                >
                  <Copy className="h-5 w-5" /> Copy {templateType.toUpperCase()} Format
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
