import { Metadata } from "next";
import { WatermarkPdfClient } from "./client";

export const metadata: Metadata = {
  title: "Add Watermark to PDF",
  description: "Add a custom text watermark to all pages of your PDF document. Secure and client-side.",
};

export default function WatermarkPdfPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Add Watermark to PDF</h1>
        <p className="text-muted-foreground">
          Apply a custom text watermark diagonally across all pages of your PDF. 
          The document is processed entirely in your browser.
        </p>
      </div>
      <WatermarkPdfClient />
    </div>
  );
}
