import { Metadata } from "next";
import { SplitPdfClient } from "./client";

export const metadata: Metadata = {
  title: "Split PDF",
  description: "Extract specific pages or split a PDF into a new document. Your files never leave your device.",
};

export default function SplitPdfPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Split PDF</h1>
        <p className="text-muted-foreground">
          Extract specific pages from a PDF to create a new, smaller document. 
          Everything runs entirely in your browser maintaining full privacy of your documents.
        </p>
      </div>
      <SplitPdfClient />
    </div>
  );
}
