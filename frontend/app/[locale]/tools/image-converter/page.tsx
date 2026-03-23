import { Metadata } from "next";
import { ImageConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Image Format Converter",
  description: "Convert images between JPG, PNG, WEBP, and BMP instantly in your browser. No server uploads required.",
};

export default function ImageConverterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Image Format Converter</h1>
        <p className="text-muted-foreground">
          Instantly convert your images into different formats like PNG, JPEG, or WebP. 
          Everything runs locally on your device for absolute privacy and zero waiting time.
        </p>
      </div>
      <ImageConverterClient />
    </div>
  );
}
