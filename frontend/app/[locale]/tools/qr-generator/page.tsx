import { Metadata } from "next";
import { QrGeneratorClient } from "./client";

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "Create custom QR codes instantly. Customize colors and download high-quality QR codes for free.",
};

export default function QrGeneratorPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">QR Code Generator</h1>
        <p className="text-muted-foreground">
          Generate custom, high-quality QR codes from any text or URL instantly. Customize the colors and download the resulting image.
        </p>
      </div>
      <QrGeneratorClient />
    </div>
  );
}
