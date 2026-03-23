import { Metadata } from "next";
import { AudioConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Audio Format Converter",
  description: "Convert audio files between MP3, WAV, and OGG seamlessly in your browser. Powered by offline FFmpeg WASM.",
};

export default function AudioConverterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Audio Format Converter</h1>
        <p className="text-muted-foreground">
          Convert audio tracks between popular formats like MP3, WAV, and OGG instantly.
          Processing happens entirely on your own device—no tracking, no uploads, absolute privacy.
        </p>
      </div>
      <AudioConverterClient />
    </div>
  );
}
