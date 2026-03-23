import { Metadata } from "next";
import { BarcodeGeneratorClient } from "./client";

export const metadata: Metadata = {
  title: "Barcode Generator",
  description: "Generate standard 1D barcodes instantly. Create high-quality barcodes for free directly in your browser.",
};

export default function BarcodeGeneratorPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Barcode Generator</h1>
        <p className="text-muted-foreground">
          Create standard barcodes (Code 128) instantly. Enter your data, adjust settings, and download a high-quality barcode image ready for printing.
        </p>
      </div>
      <BarcodeGeneratorClient />
    </div>
  );
}
