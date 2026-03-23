import { Metadata } from "next";
import { QrReaderClient } from "./client";

export const metadata: Metadata = {
  title: "QR Code Reader (From Image)",
  description: "Upload an image containing a QR code to decode its contents instantly. Fast, free, and fully client-side.",
};

export default function QrReaderPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">QR Code Reader</h1>
        <p className="text-muted-foreground">
          Upload an image, screenshot, or photo containing a QR Code to extract its hidden data. 
          Everything is processed safely inside your browser without uploading to any server.
        </p>
      </div>
      <QrReaderClient />
    </div>
  );
}
