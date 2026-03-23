import { Metadata } from "next";
import { WordCounterClient } from "./client";

export const metadata: Metadata = {
  title: "Word & Character Counter",
  description: "Count words, characters, sentences, and paragraphs in real-time. Estimate reading times instantly.",
};

export default function WordCounterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Word & Character Counter</h1>
        <p className="text-muted-foreground">
          Instantly get accurate statistics about your text. See the number of words, characters, sentences, paragraphs, and estimated reading time.
        </p>
      </div>
      <WordCounterClient />
    </div>
  );
}
