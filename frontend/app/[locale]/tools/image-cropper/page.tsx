import { Metadata } from "next";
import { ImageCropperClient } from "./client";

export const metadata: Metadata = {
  title: "Image Cropper",
  description: "Crop images quickly in your browser. Select ratios, adjust the box, and download the cropped image securely.",
};

export default function ImageCropperPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Image Cropper</h1>
        <p className="text-muted-foreground">
          Upload an image, draw a selection box to crop it, and instantly download the result. Completely private and client-side processing.
        </p>
      </div>
      <ImageCropperClient />
    </div>
  );
}
