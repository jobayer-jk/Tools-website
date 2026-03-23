import { Metadata } from "next";
import { ArchiveExtractorClient } from "./client";

export const metadata: Metadata = {
  title: "Archive Extractor (Unzip Online)",
  description: "Extract and unzip .zip files securely right in your browser. View contents and download specific files without uploading.",
};

export default function ArchiveExtractorPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Archive Extractor (Unzip)</h1>
        <p className="text-muted-foreground">
          View the contents of your `.zip` files and extract what you need. 
          Everything runs entirely on your device, meaning your files are completely secure and private.
        </p>
      </div>
      <ArchiveExtractorClient />
    </div>
  );
}
