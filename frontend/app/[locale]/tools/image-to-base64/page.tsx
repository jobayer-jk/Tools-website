import { Metadata } from "next";
import { ImageToBase64Client } from "./client";

export const metadata: Metadata = {
  title: "Image to Base64",
  description: "Convert images to Base64 data strings. Perfect for embedding images directly into HTML/CSS files.",
};

export default function ImageToBase64Page() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Image To Base64</h1>
        <p className="text-muted-foreground">
          Upload an image to instantly generate a Base64 data string. Use this string to embed images directly into your HTML `&lt;img&gt;` tags or CSS `background-image` properties.
        </p>
      </div>
      <ImageToBase64Client />
    </div>
  );
}
