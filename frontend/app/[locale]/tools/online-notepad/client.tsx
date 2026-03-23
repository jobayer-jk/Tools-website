"use client";

import { useState, useEffect } from "react";
import { Copy, Trash2, Download, CloudOff, CloudSnow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const STORAGE_KEY = "webtools_notepad_content";

export function OnlineNotepadClient() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"saving" | "saved" | "idle">("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setText(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setStatus("saving");
    
    // Debounce the save to localStorage
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, text);
      setStatus("saved");
      
      // Reset back to idle after a moment
      setTimeout(() => setStatus("idle"), 2000);
    }, 500);

    return () => clearTimeout(timeout);
  }, [text, mounted]);

  const copyToClipboard = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text.");
    }
  };

  const clearAll = () => {
    if (confirm("Are you sure you want to delete all notes? This cannot be undone.")) {
      setText("");
      localStorage.removeItem(STORAGE_KEY);
      toast.success("Notepad cleared.");
    }
  };

  const dlTextFile = () => {
    if (!text) return;
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `notes-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Notes downloaded!");
  };

  if (!mounted) {
    return (
      <Card className="border-none shadow-sm min-h-[500px] flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
          <CloudSnow className="h-5 w-5 animate-spin" /> Loading notepad...
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm relative overflow-hidden flex flex-col min-h-[600px] sm:min-h-[700px]">
      <div className="border-b bg-muted/20 p-2 sm:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium pl-2">
          {status === "saving" ? (
            <span className="text-amber-500 flex items-center gap-1.5 animate-pulse">
              <CloudOff className="h-4 w-4" /> Saving...
            </span>
          ) : status === "saved" ? (
            <span className="text-green-500 flex items-center gap-1.5">
              <CloudSnow className="h-4 w-4" /> All changes saved
            </span>
          ) : (
            <span className="text-muted-foreground flex items-center gap-1.5">
              <CloudSnow className="h-4 w-4" /> Autosave enabled
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clearAll} className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Delete</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={dlTextFile} disabled={!text} className="gap-2 text-muted-foreground hover:text-foreground">
            <Download className="h-4 w-4" /> <span className="hidden sm:inline">Download</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!text} className="gap-2 text-primary hover:text-primary">
            <Copy className="h-4 w-4" /> <span className="hidden sm:inline">Copy</span>
          </Button>
        </div>
      </div>
      
      <CardContent className="p-0 flex-1 flex flex-col">
        <Textarea 
          placeholder="Start typing your notes here. They will be automatically saved to your browser..."
          className="flex-1 min-h-[500px] border-0 rounded-none resize-none p-6 sm:p-8 text-base leading-relaxed focus-visible:ring-0 bg-transparent custom-scrollbar"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={true}
        />
        
        <div className="border-t bg-muted/5 p-3 flex flex-wrap items-center justify-between text-xs text-muted-foreground px-6">
          <span>Words: {text.trim() === "" ? 0 : text.trim().split(/\s+/).length}</span>
          <span>Characters: {text.length}</span>
          <span className="hidden sm:inline">Last edited: {new Date().toLocaleTimeString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
