import { Metadata } from "next";
import { ImageToPdfClient } from "./client";

export const metadata: Metadata = {
  title: "Image to PDF",
  description: "Convert multiple JPG, PNG, and WebP images into a single multi-page PDF document. Secure and fast.",
};

export default function ImageToPdfPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Image To PDF Converter</h1>
        <p className="text-muted-foreground">
          Convert one or multiple images seamlessly into a single PDF document.
          Everything is processed safely within your browser.
        </p>
      </div>
      <ImageToPdfClient />
    </div>
  );
}
