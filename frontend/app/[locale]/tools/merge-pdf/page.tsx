import { Metadata } from "next";
import { MergePdfClient } from "./client";

export const metadata: Metadata = {
  title: "Merge PDF",
  description: "Combine multiple PDF documents into a single PDF file instantly. Free, secure, and works offline.",
};

export default function MergePdfPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Merge PDF</h1>
        <p className="text-muted-foreground">
          Combine and merge multiple PDF files into one single document. 
          All processing is securely done inside your browser without uploading files to any server.
        </p>
      </div>
      <MergePdfClient />
    </div>
  );
}
