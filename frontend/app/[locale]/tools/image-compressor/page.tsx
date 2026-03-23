import { Metadata } from "next";
import { ImageCompressorClient } from "./client";

export const metadata: Metadata = {
  title: "Image Compressor",
  description: "Compress images locally in your browser. Reduce file size without losing visible quality using HTML5 Canvas.",
};

export default function ImageCompressorPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Image Compressor</h1>
        <p className="text-muted-foreground">
          Reduce the file size of your images drastically. Perfect for SEO optimization or saving space.
          No files are uploaded; compression happens entirely on your device.
        </p>
      </div>
      <ImageCompressorClient />
    </div>
  );
}
