"use client";

import { useState, useEffect } from "react";
import { Copy, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Standard Lorem Ipsum text blocks
const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", 
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", 
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", 
  "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat",
  "duis", "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse",
  "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat",
  "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

const generateSentence = () => {
  const wordCount = Math.floor(Math.random() * 10) + 5; // 5 to 15 words
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  let sentence = words.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
};

const generateParagraph = () => {
  const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3 to 7 sentences
  const sentences = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(" ");
};

export function LoremIpsumClient() {
  const [output, setOutput] = useState("");
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(3);

  const generate = () => {
    const validCount = Math.max(1, Math.min(count, 100)); // Cap at 100 for safety
    if (count !== validCount) setCount(validCount);

    let result = [];
    
    if (type === "paragraphs") {
      for (let i = 0; i < validCount; i++) {
        result.push(generateParagraph());
      }
      setOutput(result.join("\n\n"));
    } 
    else if (type === "sentences") {
      for (let i = 0; i < validCount; i++) {
        result.push(generateSentence());
      }
      setOutput(result.join(" "));
    } 
    else if (type === "words") {
      const words = [];
      for (let i = 0; i < validCount; i++) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      let string = words.join(" ");
      setOutput(string.charAt(0).toUpperCase() + string.slice(1) + ".");
    }
  };

  useEffect(() => {
    generate();
  }, [type, count]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text.");
    }
  };

  return (
    <Card className="border-none">
      <div className="p-6 border-b bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="grid gap-2">
            <Label>Count</Label>
            <Input 
              type="number" 
              min={1} 
              max={100} 
              className="w-24 font-mono text-center" 
              value={count} 
              onChange={(e) => setCount(Number(e.target.value) || 1)}
            />
          </div>
          <div className="grid gap-2 flex-1">
            <Label>Type</Label>
            <Tabs value={type} onValueChange={(v) => setType(v as any)} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="paragraphs">Paragraphs</TabsTrigger>
                <TabsTrigger value="sentences">Sentences</TabsTrigger>
                <TabsTrigger value="words">Words</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-0 pt-2 md:pt-0">
          <Button variant="outline" onClick={generate} className="gap-2">
            <RefreshCcw className="h-4 w-4" /> Regenerate
          </Button>
          <Button onClick={copyToClipboard} disabled={!output} className="gap-2">
            <Copy className="h-4 w-4" /> Copy
          </Button>
        </div>
      </div>
      
      <CardContent className="p-0">
        <div className="p-6 min-h-[300px] text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {output}
        </div>
      </CardContent>
    </Card>
  );
}
