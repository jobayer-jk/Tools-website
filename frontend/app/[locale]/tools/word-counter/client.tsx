"use client";

import { useState, useMemo } from "react";
import { Copy, Trash2, FileText, Type, Hash, Clock, AlignLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function WordCounterClient() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s+/g, "").length;

    // Words: split by whitespace, filter out empty strings
    const words = text.trim() === "" ? [] : text.trim().split(/\s+/);
    const wordCount = words.length;

    // Sentences: generic split by . ! ?
    const sentences = text.trim() === "" ? [] : text.split(/[.!?]+/).filter(Boolean);
    const sentenceCount = sentences.length;

    // Paragraphs: split by double newlines or single newlines
    const paragraphs = text.trim() === "" ? [] : text.trim().split(/\n+/);
    const paragraphCount = paragraphs.length;

    // Reading time (average adult reads 238 words per minute)
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 238));

    return {
      chars,
      charsNoSpaces,
      wordCount,
      sentenceCount,
      paragraphCount,
      readTimeMinutes
    };
  }, [text]);

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

  const statCards = [
    { label: "Words", value: stats.wordCount, icon: FileText, color: "text-blue-500" },
    { label: "Characters", value: stats.chars, icon: Type, color: "text-amber-500" },
    { label: "Characters (no spaces)", value: stats.charsNoSpaces, icon: Hash, color: "text-emerald-500" },
    { label: "Sentences", value: stats.sentenceCount, icon: AlignLeft, color: "text-purple-500" },
    { label: "Paragraphs", value: stats.paragraphCount, icon: BookOpen, color: "text-pink-500" },
    { label: "Reading Time", value: `~${stats.readTimeMinutes} min`, icon: Clock, color: "text-cyan-500" },
  ];

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex flex-wrap items-center gap-2">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="flex items-center justify-center gap-2 border border-border/60 bg-card rounded-sm shadow-sm text-sm px-6 sm:px-7 h-12 whitespace-nowrap group"
            >
              <Icon className={`h-4 w-4 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
              <span className="text-muted-foreground font-medium">{stat.label}:</span>
              <span className={`font-bold ${stat.color}`}>{stat.value}</span>
            </div>
          );
        })}
      </div>

      <Card className="border border-border/40 shadow-sm flex-1 flex flex-col">
        <div className="border-b bg-muted/20 p-2 sm:px-4 flex items-center justify-between">
          <span className="text-sm font-medium pl-2 text-muted-foreground">Text Input</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1.5 text-muted-foreground hover:text-foreground h-8">
              <Trash2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline text-xs">Clear</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!text} className="gap-1.5 text-muted-foreground hover:text-foreground h-8">
              <Copy className="h-3.5 w-3.5" /> <span className="hidden sm:inline text-xs">Copy</span>
            </Button>
          </div>
        </div>
        <CardContent className="p-0 flex-1 flex flex-col">
          <Textarea
            placeholder="Type or paste your text here to begin counting..."
            className="min-h-[400px] sm:min-h-[500px] flex-1 border-0 rounded-none resize-y p-6 text-base md:text-lg leading-relaxed focus-visible:ring-0 bg-transparent"
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
