import { Metadata } from "next";
import { ColorConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Color Converter (HEX/RGB/HSL)",
  description: "Easily convert colors between HEX, RGB, and HSL formats with a real-time visual preview.",
};

export default function ColorConverterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Color Converter</h1>
        <p className="text-muted-foreground">
          Convert color codes instantly between HEX, RGB, and HSL formats. Paste any valid color format to see its equivalents and a visual preview.
        </p>
      </div>
      <ColorConverterClient />
    </div>
  );
}
