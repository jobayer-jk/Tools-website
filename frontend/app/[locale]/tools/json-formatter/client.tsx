"use client";

import { useState } from "react";
import { Copy, Trash2, AlignLeft, Minimize2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const formatJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setInput(formatted);
      setStatus("valid");
      setErrorMessage("");
    } catch (e: any) {
      setStatus("invalid");
      setErrorMessage(e.message || "Invalid JSON");
    }
  };

  const minifyJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setInput(minified);
      setStatus("valid");
      setErrorMessage("");
    } catch (e: any) {
      setStatus("invalid");
      setErrorMessage(e.message || "Invalid JSON");
    }
  };

  const copyToClipboard = async () => {
    if (!input) return;
    try {
      await navigator.clipboard.writeText(input);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text.");
    }
  };

  const clearAll = () => {
    setInput("");
    setStatus("idle");
    setErrorMessage("");
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    if (val.trim() === "") {
      setStatus("idle");
      setErrorMessage("");
      return;
    }
    // Auto-validate softly on change (without re-formatting to not interrupt typing)
    try {
      JSON.parse(val);
      setStatus("valid");
      setErrorMessage("");
    } catch (e: any) {
      setStatus("invalid");
      // Don't show aggressive error message while typing normally, just status indicator
      setErrorMessage(""); 
    }
  };

  return (
    <Card className="border-none">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="default" size="sm" onClick={formatJson} className="gap-2">
              <AlignLeft className="h-4 w-4" />
              Format / Beautify
            </Button>
            <Button variant="secondary" size="sm" onClick={minifyJson} className="gap-2">
              <Minimize2 className="h-4 w-4" />
              Minify
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearAll} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
            <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!input} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative group focus-within:ring-2 focus-within:ring-ring outline-none">
          {/* Status Indicator Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 z-10 flex">
            <div className={cn(
              "h-full w-full transition-colors",
              status === "valid" ? "bg-green-500" : 
              status === "invalid" ? "bg-destructive" : "bg-transparent"
            )} />
          </div>

          <Textarea 
            placeholder="Paste your JSON here..."
            className={cn(
              "min-h-[500px] border-0 rounded-none resize-y font-mono text-sm leading-relaxed p-6 focus-visible:ring-0",
              status === "invalid" && input ? "text-destructive placeholder:text-destructive/50" : ""
            )}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            spellCheck={false}
          />
          
          {/* Bottom Error/Status Bar */}
          {status !== "idle" && input && (
            <div className={cn(
              "absolute bottom-0 left-0 right-0 p-2 px-4 text-xs font-medium flex items-center gap-2",
              status === "valid" ? "bg-green-500/10 text-green-600 dark:text-green-500 border-t border-green-500/20" : 
              "bg-destructive/10 text-destructive border-t border-destructive/20"
            )}>
              {status === "valid" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Valid JSON</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  <span>{errorMessage || "Invalid JSON"}</span>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
