import { Metadata } from "next";
import { ImageResizerClient } from "./client";

export const metadata: Metadata = {
  title: "Image Resizer",
  description: "Resize images to exact pixel dimensions instantly. Change width and height without losing quality.",
};

export default function ImageResizerPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Image Resizer</h1>
        <p className="text-muted-foreground">
          Upload an image, enter your desired dimensions, and instantly download the resized version.
          Everything is processed safely within your browser.
        </p>
      </div>
      <ImageResizerClient />
    </div>
  );
}
