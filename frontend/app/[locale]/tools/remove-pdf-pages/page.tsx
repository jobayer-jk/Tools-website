import { Metadata } from "next";
import { RemovePdfPagesClient } from "./client";

export const metadata: Metadata = {
  title: "Remove PDF Pages",
  description: "Delete specific pages from a PDF document securely in your browser. Fast, free, and private.",
};

export default function RemovePdfPagesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Remove PDF Pages</h1>
        <p className="text-muted-foreground">
          Upload a PDF and selectively delete unwanted pages. The trimmed document is processed 
          entirely on your device, ensuring maximum privacy and security.
        </p>
      </div>
      <RemovePdfPagesClient />
    </div>
  );
}
