"use client";

import { useState, useRef, ChangeEvent } from "react";
import { UploadCloud, Download, FileText, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

// Format bytes nicely
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function MergePdfClient() {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | File[]) => {
    const validPdfs = Array.from(files).filter(f => f.type === "application/pdf");
    if (validPdfs.length !== files.length) {
      toast.error("Only PDF files are allowed.");
    }

    if (validPdfs.length > 0) {
      const newFiles = validPdfs.map(f => ({
        id: Math.random().toString(36).substring(7),
        file: f,
        name: f.name,
        size: f.size
      }));
      setPdfFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFiles(e.target.files);
  };

  const removeFile = (id: string) => {
    setPdfFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const items = [...pdfFiles];
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    setPdfFiles(items);
  };

  const moveDown = (index: number) => {
    if (index === pdfFiles.length - 1) return;
    const items = [...pdfFiles];
    [items[index + 1], items[index]] = [items[index], items[index + 1]];
    setPdfFiles(items);
  };

  const clearAll = () => {
    setPdfFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const mergePdfs = async () => {
    if (pdfFiles.length < 2) {
      toast.error("Please add at least 2 PDF files to merge.");
      return;
    }

    try {
      setIsMerging(true);
      
      // Create a new empty Document
      const mergedPdf = await PDFDocument.create();

      for (const pdfItem of pdfFiles) {
        // Read file as ArrayBuffer
        const arrayBuffer = await pdfItem.file.arrayBuffer();
        
        // Load the ArrayBuffer into a PDFDocument
        const pdf = await PDFDocument.load(arrayBuffer);
        
        // Copy all pages
        const pageIndices = Array.from({ length: pdf.getPageCount() }, (_, i) => i);
        const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);
        
        // Add pages to the merged doc
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // Serialize the requested PDFDocument to bytes
      const pdfBytes = await mergedPdf.save();
      
      // Trigger Download
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `merged-${pdfFiles.length}-files.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("PDFs merged successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to merge PDFs. One of the documents might be encrypted or corrupted.");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      
      {/* Upload Column */}
      <Card className="lg:col-span-4 border-none shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="border-b bg-muted/20 p-4 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Add PDFs
          </span>
          {pdfFiles.length > 0 && (
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
              pdfFiles.length > 0 && "min-h-[200px]"
            )}
          >
            <div className="p-4 bg-muted rounded-full mb-4">
              <UploadCloud className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Upload PDFs</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Drag & drop or click to select multiple PDF files.
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="application/pdf" 
              className="hidden" 
              multiple 
            />
          </div>
        </CardContent>
      </Card>

      {/* Reorder and Action Column */}
      <Card className="lg:col-span-8 border-none shadow-sm relative overflow-hidden flex flex-col min-h-[400px]">
        <div className="border-b bg-muted/10 p-4 font-semibold text-muted-foreground flex items-center justify-between">
          <span>Arrange Order ({pdfFiles.length} files)</span>
          {pdfFiles.length > 1 && (
            <Button 
              onClick={mergePdfs} 
              size="sm"
              disabled={isMerging}
              className="gap-2 font-semibold"
            >
              <Download className="h-4 w-4" /> {isMerging ? "Merging..." : "Merge Now"}
            </Button>
          )}
        </div>
        
        <CardContent className="p-0 flex-1 flex flex-col">
          {pdfFiles.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-8 bg-muted/5 min-h-[300px]">
              <FileText className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">No PDFs Added Yet</p>
              <p className="text-sm mt-2 opacity-70">Add at least two PDF files to merge them together.</p>
            </div>
          ) : (
            <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
              {pdfFiles.map((file, index) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg bg-card shadow-sm hover:border-primary/50 transition-colors group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-red-500/10 text-red-500 p-2 rounded shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold truncate max-w-[200px] sm:max-w-[400px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => moveUp(index)} disabled={index === 0} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => moveDown(index)} disabled={index === pdfFiles.length - 1} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {pdfFiles.length === 1 && (
            <div className="p-4 bg-amber-500/10 text-amber-600 dark:text-amber-500 text-center text-sm font-medium border-t">
              Add at least one more PDF to merge.
            </div>
          )}

        </CardContent>
      </Card>
      
    </div>
  );
}
