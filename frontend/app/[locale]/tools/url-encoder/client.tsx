"use client";

import { useState } from "react";
import { Copy, Trash2, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function UrlEncoderClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  const handleProcess = (val: string, currentMode: "encode" | "decode") => {
    setInput(val);
    setError("");
    
    if (!val) {
      setOutput("");
      return;
    }

    try {
      if (currentMode === "encode") {
        setOutput(encodeURIComponent(val));
      } else {
        setOutput(decodeURIComponent(val));
      }
    } catch (e: any) {
      setError("Malformed URI sequence.");
      setOutput("");
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
    setError("");
  };

  const toggleMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    handleProcess(input, newMode);
  };

  return (
    <Card className="border-none">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Tabs value={mode} onValueChange={(v) => {
            setMode(v as any);
            handleProcess(input, v as any);
          }} className="w-full max-w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode">Encode URL</TabsTrigger>
              <TabsTrigger value="decode">Decode URL</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearAll} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
            <Button size="sm" onClick={copyToClipboard} disabled={!output} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy Output
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 grid gap-6">
        <div className="grid gap-2">
          <label className="text-sm font-medium">
            Input {mode === "encode" ? "Text or URI segment" : "Encoded URL string"}
          </label>
          <Textarea 
            placeholder={mode === "encode" ? "e.g., Hello World! & @ #" : "e.g., Hello%20World!%20%26%20%40%20%23"}
            className="min-h-[150px] resize-y font-mono text-sm leading-relaxed p-4"
            value={input}
            onChange={(e) => handleProcess(e.target.value, mode)}
          />
        </div>

        <div className="flex justify-center -my-3 relative z-10">
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full h-10 w-10 border-2 border-background shadow-md hover:scale-105 transition-transform"
            onClick={toggleMode}
            title="Swap encode/decode mode"
          >
            <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        <div className="grid gap-2 focus-within:ring-2 focus-within:ring-ring rounded-md overflow-hidden transition-all">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Output {mode === "encode" ? "Encoded URI" : "Decoded Text"}
            </label>
            {error && <span className="text-sm font-medium text-destructive">{error}</span>}
          </div>
          <Textarea 
            readOnly
            placeholder={error ? "" : "Result will appear here..."}
            className={cn(
              "min-h-[150px] resize-y font-mono text-sm leading-relaxed p-4 bg-muted/50",
              error ? 'border-destructive focus-visible:ring-destructive text-destructive' : ''
            )}
            value={output}
          />
        </div>
      </CardContent>
    </Card>
  );
}
