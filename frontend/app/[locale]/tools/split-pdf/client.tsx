"use client";

import { useState, useRef, ChangeEvent } from "react";
import { UploadCloud, Download, FileText, Trash2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function SplitPdfClient() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [extractedPages, setExtractedPages] = useState<string>("1-5");
  
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    try {
      setPdfFile(file);
      // Quickly load just to get page count
      const arrayBuffer = await file.slice(0).arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const count = pdf.getPageCount();
      setTotalPages(count);
      setExtractedPages(`1-${Math.min(count, 5)}`); // Default range
    } catch (e) {
      toast.error("Failed to read PDF. It might be encrypted or corrupted.");
      setPdfFile(null);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
  };

  const clearAll = () => {
    setPdfFile(null);
    setTotalPages(0);
    setExtractedPages("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Parses ranges like "1-3, 5, 7-9" into an ordered unique array of 0-based indices
  const parseRanges = (rangeStr: string, maxPages: number): number[] => {
    const indices = new Set<number>();
    const parts = rangeStr.replace(/\s+/g, "").split(",");
    
    for (const part of parts) {
      if (!part) continue;
      
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        if (isNaN(start) || isNaN(end)) continue;
        for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
          if (i >= 1 && i <= maxPages) indices.add(i - 1);
        }
      } else {
        const num = Number(part);
        if (!isNaN(num) && num >= 1 && num <= maxPages) {
          indices.add(num - 1);
        }
      }
    }
    
    return Array.from(indices).sort((a, b) => a - b);
  };

  const splitPdf = async () => {
    if (!pdfFile) return;

    const indicesToExtract = parseRanges(extractedPages, totalPages);
    if (indicesToExtract.length === 0) {
      toast.error("Please provide a valid page range.");
      return;
    }

    try {
      setIsProcessing(true);
      
      const arrayBuffer = await pdfFile.arrayBuffer();
      const ogPdf = await PDFDocument.load(arrayBuffer);
      const targetPdf = await PDFDocument.create();

      const copiedPages = await targetPdf.copyPages(ogPdf, indicesToExtract);
      copiedPages.forEach((page) => targetPdf.addPage(page));

      const pdfBytes = await targetPdf.save();
      
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `extracted-${pdfFile.name}`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success(`Extracted ${indicesToExtract.length} pages successfully!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to split PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      
      {/* Upload Column */}
      <Card className="border-none shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="border-b bg-muted/20 p-4 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Source PDF
          </span>
          {pdfFile && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 gap-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" /> Reset
            </Button>
          )}
        </div>
        
        <CardContent className="p-6 flex-1 flex flex-col justify-center">
          {!pdfFile ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault(); setIsDragging(false);
                if (e.dataTransfer.files?.length) processFile(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12 text-center cursor-pointer min-h-[300px] transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/30"
              )}
            >
              <div className="p-4 bg-muted rounded-full mb-4">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Upload PDF</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Drag & drop or click to select a PDF file.
              </p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="application/pdf" className="hidden" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-muted/10 rounded-xl border p-8 min-h-[300px] text-center">
              <div className="bg-red-500/10 text-red-500 p-6 rounded-2xl mb-4">
                <FileText className="h-16 w-16" />
              </div>
              <h3 className="font-bold text-lg max-w-[250px] truncate">{pdfFile.name}</h3>
              <div className="mt-2 text-sm text-muted-foreground font-medium flex gap-4">
                <span>{formatBytes(pdfFile.size)}</span>
                <span>•</span>
                <span className="text-primary">{totalPages} Pages Total</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Column */}
      <Card className="border-none shadow-sm relative overflow-hidden flex flex-col min-h-[400px]">
        <div className="border-b bg-muted/10 p-4 font-semibold text-muted-foreground">
          Extraction Settings
        </div>
        
        <CardContent className="p-0 flex-1 flex flex-col">
          {!pdfFile ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-8 bg-muted/5">
              <FileText className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">Waiting for PDF...</p>
              <p className="text-sm mt-2 opacity-70">Upload a PDF on the left to select pages to extract.</p>
            </div>
          ) : (
            <div className="p-6 space-y-8 flex-1 flex flex-col">
              
              <div className="space-y-4">
                <Label className="text-base font-semibold">Pages to Extract</Label>
                <Input 
                  value={extractedPages}
                  onChange={(e) => setExtractedPages(e.target.value)}
                  placeholder="e.g., 1-5, 8, 11-13" 
                  className="font-mono text-lg h-12"
                />
                <p className="text-sm text-muted-foreground">
                  Valid examples: <code>1-3</code>, <code>1, 3, 5</code>, <code>2-4, 8</code>. The document has {totalPages} pages maximum.
                </p>
              </div>

              <div className="p-4 bg-muted/20 border rounded-lg">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground">Will extract:</span>
                  <span className="text-primary font-bold">{parseRanges(extractedPages, totalPages).length} Pages</span>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t">
                <Button 
                  onClick={splitPdf} 
                  size="lg"
                  disabled={isProcessing || !extractedPages}
                  className="w-full gap-2 font-semibold text-base h-14"
                >
                  <Download className="h-5 w-5" /> 
                  {isProcessing ? "Processing..." : "Extract & Download PDF"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
