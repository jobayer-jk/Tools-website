"use client";

import { useState } from "react";
import { ArrowDownUp, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function Base64Client() {
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
        // Encode text to base64
        // Use encodeURIComponent to handle special characters/unicode
        const encoded = btoa(unescape(encodeURIComponent(val)));
        setOutput(encoded);
      } else {
        // Decode base64 to text
        const decoded = decodeURIComponent(escape(atob(val)));
        setOutput(decoded);
      }
    } catch (e) {
      setError(currentMode === "encode" ? "Failed to encode text." : "Invalid Base64 string.");
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
    <Card className="border-none shadow-md bg-muted/20">
      <CardHeader className="bg-muted rounded-t-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Tabs value={mode} onValueChange={(v) => {
            setMode(v as any);
            handleProcess(input, v as any);
          }} className="w-full max-w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode">Encode to Base64</TabsTrigger>
              <TabsTrigger value="decode">Decode Base64</TabsTrigger>
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
            Input {mode === "encode" ? "Text" : "Base64"}
          </label>
          <Textarea
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
            className="min-h-[200px] resize-y font-mono text-sm leading-relaxed p-4 border-none shadow-sm bg-muted focus-visible:ring-1"
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
              Output {mode === "encode" ? "Base64" : "Text"}
            </label>
            {error && <span className="text-sm font-medium text-destructive">{error}</span>}
          </div>
          <Textarea
            readOnly
            placeholder={error ? "" : "Result will appear here..."}
            className={`min-h-[200px] resize-y font-mono text-sm leading-relaxed p-4 border-none shadow-sm bg-muted ${error ? 'border-destructive focus-visible:ring-destructive text-destructive bg-destructive/10' : ''}`}
            value={output}
          />
        </div>
      </CardContent>
    </Card>
  );
}
