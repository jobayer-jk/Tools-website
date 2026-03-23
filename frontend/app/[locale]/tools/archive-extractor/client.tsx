"use client";

import { useState, useRef, ChangeEvent } from "react";
import JSZip from "jszip";
import { UploadCloud, Download, FileArchive, File as FileIcon, Trash2, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ExtractedFile {
  name: string;
  size: number;
  dir: boolean;
  contentObj: JSZip.JSZipObject;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function ArchiveExtractorClient() {
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.name.endsWith(".zip") && file.type !== "application/zip" && file.type !== "application/x-zip-compressed") {
      toast.error("Please upload a valid .zip file.");
      return;
    }

    try {
      setIsProcessing(true);
      setZipFile(file);
      
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      
      const filesArr: ExtractedFile[] = [];
      contents.forEach((relativePath, zipEntry) => {
        // Skip hidden macOS files if present
        if (!relativePath.includes("__MACOSX/") && !relativePath.includes(".DS_Store")) {
          filesArr.push({
            name: relativePath,
            size: (zipEntry as any)._data?.uncompressedSize || 0,
            dir: zipEntry.dir,
            contentObj: zipEntry
          });
        }
      });
      
      // Sort: folders first, then alphabetical
      filesArr.sort((a, b) => {
        if (a.dir && !b.dir) return -1;
        if (!a.dir && b.dir) return 1;
        return a.name.localeCompare(b.name);
      });

      setExtractedFiles(filesArr);
      toast.success(`Successfully read ${filesArr.length} items from archive.`);
    } catch (e) {
      toast.error("Failed to parse the ZIP file. It might be corrupted or encrypted.");
      setZipFile(null);
      setExtractedFiles([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
  };

  const clearAll = () => {
    setZipFile(null);
    setExtractedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadFile = async (file: ExtractedFile) => {
    if (file.dir) return; // Cannot download arbitrary directory directly
    
    try {
      const blob = await file.contentObj.async("blob");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Extract just the valid filename from the path
      const parts = file.name.split("/");
      link.download = parts[parts.length - 1] || "extracted-file";
      
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${link.download}`);
    } catch (e) {
      toast.error("Failed to extract file.");
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      
      {/* Upload Column */}
      <Card className="lg:col-span-4 border-none shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="border-b bg-muted/20 p-4 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileArchive className="h-5 w-5 text-primary" /> ZIP Archive
          </span>
          {zipFile && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 gap-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
          )}
        </div>
        
        <CardContent className="p-6 flex-1 flex flex-col justify-center">
          {!zipFile ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault(); setIsDragging(false);
                if (e.dataTransfer.files?.length) processFile(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center cursor-pointer min-h-[300px] transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/30",
                isProcessing && "opacity-50 pointer-events-none"
              )}
            >
              <div className="p-4 bg-muted rounded-full mb-4">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">{isProcessing ? "Reading..." : "Upload ZIP"}</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Drag & drop or select a <code>.zip</code> file to extract its contents without uploading it.
              </p>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".zip,application/zip" className="hidden" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-muted/10 rounded-xl border p-8 text-center min-h-[300px]">
               <div className="bg-amber-500/10 text-amber-500 p-6 rounded-2xl mb-4">
                <FileArchive className="h-16 w-16" />
              </div>
              <h3 className="font-bold text-lg max-w-[250px] truncate">{zipFile.name}</h3>
              <div className="mt-2 text-sm text-muted-foreground font-medium flex gap-4">
                <span>{formatBytes(zipFile.size)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contents Column */}
      <Card className="lg:col-span-8 border-none shadow-sm relative overflow-hidden flex flex-col min-h-[400px]">
        <div className="border-b bg-muted/10 p-4 font-semibold text-muted-foreground flex items-center justify-between">
          <span>Archive Contents ({extractedFiles.length} items)</span>
        </div>
        
        <CardContent className="p-0 flex-1 flex flex-col">
          {!zipFile ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-8 bg-muted/5 min-h-[300px]">
              <FileArchive className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">No Archive Loaded</p>
              <p className="text-sm mt-2 opacity-70">Upload a ZIP file on the left to view and extract files.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto max-h-[600px] custom-scrollbar">
              {extractedFiles.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">This archive appears to be empty.</div>
              ) : (
                <div className="divide-y relative">
                  {extractedFiles.map((item, index) => {
                    const depth = item.name.split("/").length - (item.dir ? 2 : 1);
                    return (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
                        style={{ paddingLeft: `${Math.max(0.75, depth * 1.5 + 0.75)}rem` }}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {item.dir ? (
                            <Folder className="h-5 w-5 text-amber-500 shrink-0" />
                          ) : (
                            <FileIcon className="h-5 w-5 text-blue-500 shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="text-sm font-medium">
                              {/* Display only the basename */}
                              {item.dir 
                                ? item.name.split("/").slice(-2)[0] + "/" 
                                : item.name.split("/").pop()}
                            </span>
                          </div>
                        </div>
                        
                        {!item.dir && (
                          <div className="flex items-center gap-4 shrink-0 pl-4">
                            <span className="text-xs text-muted-foreground min-w-[60px] text-right">
                              {formatBytes(item.size)}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 gap-2"
                              onClick={() => downloadFile(item)}
                            >
                              <Download className="h-4 w-4" /> Extract
                            </Button>
                          </div>
                        )}
                        {item.dir && (
                          <div className="text-xs text-muted-foreground pr-4 shrink-0">Folder</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          
        </CardContent>
      </Card>
      
    </div>
  );
}
