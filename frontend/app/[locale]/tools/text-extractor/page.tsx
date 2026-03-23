import { Metadata } from "next";
import { TextExtractorClient } from "./client";

export const metadata: Metadata = {
  title: "AI Text Extractor (OCR)",
  description: "Extract text seamlessly from any image locally. Highly accurate, private, and powered by Tesseract.js.",
};

export default function TextExtractorPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Text Extractor (OCR)</h1>
        <p className="text-muted-foreground">
          Upload screenshots, documents, or photos and instantly extract the underlying text perfectly. 
          Powered by offline browser intelligence—completely free and private.
        </p>
      </div>
      <TextExtractorClient />
    </div>
  );
}
