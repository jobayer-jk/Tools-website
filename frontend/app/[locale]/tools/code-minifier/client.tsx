"use client";

import { useState } from "react";
import { Copy, Trash2, AlignLeft, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function CodeMinifierClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState<"css" | "js" | "html">("css");
  const [stats, setStats] = useState<{ orig: number; min: number } | null>(null);

  const processCode = (minifying: boolean) => {
    if (!input.trim()) return;
    
    let result = input;
    
    try {
      if (language === "css") {
        if (minifying) {
          result = result.replace(/\/\*[\s\S]*?\*\//g, ''); // remove comments
          result = result.replace(/\s+/g, ' '); // collapse spaces
          result = result.replace(/\s*([{}:;,])\s*/g, '$1'); // remove space around separators
        } else {
          // Extra basic CSS beautify for MVP
          result = result.replace(/;/g, ';\n  ').replace(/{/g, ' {\n  ').replace(/}/g, '\n}\n');
        }
      } else if (language === "js") {
        if (minifying) {
          result = result.replace(/\/\*[\s\S]*?\*\//g, ''); // block comments
          result = result.replace(/\/\/.*/g, ''); // line comments
          result = result.replace(/\s+/g, ' ').replace(/\s*([{}:;,=+\-*/<>!&|])\s*/g, '$1');
        } else {
          // Extremely basic JS beautify (just to show diff, not a real parser)
          result = result.replace(/;/g, ';\n').replace(/{/g, ' {\n  ').replace(/}/g, '\n}\n');
        }
      } else if (language === "html") {
        if (minifying) {
          result = result.replace(/<!--[\s\S]*?-->/g, ''); // comments
          result = result.replace(/>\s+</g, '><'); // spaces between tags
        } else {
          result = result.replace(/>\s*</g, '>\n<');
        }
      }
      
      setOutput(result);
      if (minifying) {
        setStats({ orig: input.length, min: result.length });
      } else {
        setStats(null);
      }
    } catch (e) {
      toast.error("Failed to process code. Try again.");
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text.");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setStats(null);
  };

  const reduction = stats ? ((stats.orig - stats.min) / stats.orig * 100).toFixed(1) : 0;

  return (
    <Card className="border-none">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Tabs value={language} onValueChange={(v) => setLanguage(v as any)} className="w-[300px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="js">JS</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearAll} className="gap-2">
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
            <Button variant="secondary" size="sm" onClick={() => processCode(false)} className="gap-2">
              <AlignLeft className="h-4 w-4" /> Beautify
            </Button>
            <Button variant="default" size="sm" onClick={() => processCode(true)} className="gap-2">
              <Minimize2 className="h-4 w-4" /> Minify
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 grid lg:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Original Code</label>
          <Textarea 
            placeholder={`Paste your ${language.toUpperCase()} code here...`}
            className="min-h-[400px] resize-y font-mono text-sm leading-relaxed p-4 bg-muted/30"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            <div className="flex items-center gap-2">
              {stats && (
                <Badge variant="secondary" className="font-mono text-green-600 dark:text-green-400 bg-green-500/10">
                  Total Saved: {reduction}%
                </Badge>
              )}
              <Button size="sm" variant="ghost" onClick={copyToClipboard} disabled={!output} className="h-8 gap-1 px-2">
                <Copy className="h-3.5 w-3.5" /> Copy
              </Button>
            </div>
          </div>
          <Textarea 
            readOnly
            placeholder="Minified or beautified code will appear here..."
            className="min-h-[400px] resize-y font-mono text-sm leading-relaxed p-4"
            value={output}
            spellCheck={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}
