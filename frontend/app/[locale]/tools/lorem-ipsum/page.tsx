import { Metadata } from "next";
import { LoremIpsumClient } from "./client";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator",
  description: "Generate dummy text for your designs and layouts instantly. Choose paragraphs, words, or bytes.",
};

export default function LoremIpsumPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Lorem Ipsum Generator</h1>
        <p className="text-muted-foreground">
          Instantly generate placeholder text for your mockups, wireframes, and prototypes. Generate exactly the amount of text you need.
        </p>
      </div>
      <LoremIpsumClient />
    </div>
  );
}
