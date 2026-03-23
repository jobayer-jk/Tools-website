import { Metadata } from "next";
import { ImageEnhancerClient } from "./client";

export const metadata: Metadata = {
  title: "Image Filter & Enhancer",
  description: "Enhance images seamlessly right in your browser. Adjust brightness, contrast, saturation, and apply beautiful aesthetic filters for free.",
};

export default function ImageEnhancerPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Image Enhancer</h1>
        <p className="text-muted-foreground">
          Apply powerful adjustments and aesthetic filters to your images natively. 
          All processing is handled directly by your device's graphics engine, ensuring zero uploads and instant rendering.
        </p>
      </div>
      <ImageEnhancerClient />
    </div>
  );
}
