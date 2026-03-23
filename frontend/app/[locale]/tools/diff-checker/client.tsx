"use client";

import { useState } from "react";
import { Trash2, FileDiff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DiffCheckerClient() {
  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [diffResult, setDiffResult] = useState<{ type: "added" | "removed" | "unchanged", value: string }[] | null>(null);

  // Very basic line-by-line diff implementation for MVP
  const compareText = () => {
    if (!originalText && !modifiedText) {
      setDiffResult(null);
      return;
    }

    const origLines = originalText.split('\n');
    const modLines = modifiedText.split('\n');
    
    const result: typeof diffResult = [];
    
    // A highly simplified diff algorithm
    const maxLines = Math.max(origLines.length, modLines.length);
    for (let i = 0; i < maxLines; i++) {
      const orig = origLines[i];
      const mod = modLines[i];

      if (orig === mod) {
        result.push({ type: "unchanged", value: orig });
      } else if (orig === undefined) {
        result.push({ type: "added", value: mod });
      } else if (mod === undefined) {
        result.push({ type: "removed", value: orig });
      } else {
        // They differ on this line -> mark removed, then added
        result.push({ type: "removed", value: orig });
        result.push({ type: "added", value: mod });
      }
    }
    
    setDiffResult(result);
  };

  const clearAll = () => {
    setOriginalText("");
    setModifiedText("");
    setDiffResult(null);
  };

  return (
    <div className="grid gap-6">
      <Card className="border-none">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileDiff className="h-5 w-5 text-primary" />
              Compare Texts
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={clearAll} className="gap-2">
                <Trash2 className="h-4 w-4" /> Clear All
              </Button>
              <Button variant="default" size="sm" onClick={compareText} className="gap-2">
                Check Differences
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
            <div className="p-4 bg-muted/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Original Text</span>
              </div>
              <Textarea 
                placeholder="Paste original text here..."
                className="min-h-[300px] resize-y font-mono text-sm leading-relaxed"
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                spellCheck={false}
              />
            </div>
            <div className="p-4 bg-muted/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Modified Text</span>
              </div>
              <Textarea 
                placeholder="Paste modified text here..."
                className="min-h-[300px] resize-y font-mono text-sm leading-relaxed"
                value={modifiedText}
                onChange={(e) => setModifiedText(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {diffResult && (
        <Card className="border-2 animate-in fade-in slide-in-from-top-4">
          <CardHeader className="border-b py-3 px-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Diff Result</h3>
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-500/20 border border-red-500/50 rounded-sm"></div>Removed</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-500/20 border border-green-500/50 rounded-sm"></div>Added</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <div className="font-mono text-sm leading-relaxed p-4 bg-zinc-950 text-zinc-300 min-h-[150px]">
              {diffResult.length === 0 && <span className="opacity-50 italic">No differences found.</span>}
              {diffResult.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`px-2 flex ${
                    line.type === "added" ? "bg-green-500/20 text-green-300" : 
                    line.type === "removed" ? "bg-red-500/20 text-red-300 line-through opacity-70" : "text-zinc-400"
                  }`}
                >
                  <span className="w-6 shrink-0 opacity-50 select-none text-right pr-2">
                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                  </span>
                  <span className="whitespace-pre-wrap flex-1">{line.value || " "}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
