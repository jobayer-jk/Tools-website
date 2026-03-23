"use client";

import { useState } from "react";
import { Copy, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function CaseConverterClient() {
  const [text, setText] = useState("");

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
    setText("");
  };

  const dlTextFile = () => {
    if (!text) return;
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "converted-text.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
    toast.success("File downloaded!");
  };

  const transform = (type: string) => {
    if (!text) return;
    let res = text;
    
    switch(type) {
      case "lower":
        res = text.toLowerCase();
        break;
      case "upper":
        res = text.toUpperCase();
        break;
      case "title":
        res = text.toLowerCase().replace(/(?:^|\s|-|\/|\()([a-z])/g, (m) => m.toUpperCase());
        break;
      case "sentence":
        res = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case "capitalize":
        // Capitalize first letter of every word
        res = text.replace(/\b\w/g, c => c.toUpperCase());
        break;
      case "alternating":
        res = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
        break;
      case "inverse":
        res = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
        break;
    }
    setText(res);
  };

  return (
    <Card className="border-none shadow-sm relative overflow-hidden">
      <div className="border-b bg-muted/20 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => transform("sentence")}>Sentence case</Button>
          <Button variant="secondary" size="sm" onClick={() => transform("lower")}>lower case</Button>
          <Button variant="secondary" size="sm" onClick={() => transform("upper")}>UPPER CASE</Button>
          <Button variant="secondary" size="sm" onClick={() => transform("capitalize")}>Capitalized Case</Button>
          <Button variant="secondary" size="sm" onClick={() => transform("title")}>Title Case</Button>
          <Button variant="secondary" size="sm" onClick={() => transform("alternating")}>aLtErNaTiNg cAsE</Button>
          <Button variant="secondary" size="sm" onClick={() => transform("inverse")}>InVeRsE CaSe</Button>
        </div>
      </div>
      
      <CardContent className="p-0">
        <Textarea 
          placeholder="Type or paste your text here to convert..."
          className="min-h-[400px] border-0 rounded-none resize-y p-6 text-base leading-relaxed focus-visible:ring-0 bg-transparent"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
        />
        
        <div className="border-t bg-muted/10 p-2 sm:px-4 flex flex-wrap items-center justify-between">
          <span className="text-xs text-muted-foreground pl-2 hidden sm:inline">
            Characters Mapped: {text.length}
          </span>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="ghost" size="sm" onClick={clearAll} className="flex-1 sm:flex-none gap-2 text-muted-foreground hover:text-foreground">
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
            <Button variant="ghost" size="sm" onClick={dlTextFile} disabled={!text} className="flex-1 sm:flex-none gap-2 text-muted-foreground hover:text-foreground">
              <Download className="h-4 w-4" /> Download
            </Button>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!text} className="flex-1 sm:flex-none gap-2 text-primary hover:text-primary">
              <Copy className="h-4 w-4" /> Copy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
