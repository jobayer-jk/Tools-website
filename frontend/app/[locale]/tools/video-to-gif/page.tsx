import { Metadata } from "next";
import { VideoToGifClient } from "./client";

export const metadata: Metadata = {
  title: "Video to GIF Converter",
  description: "Convert MP4 and WebM videos into animated GIFs entirely in your browser using FFmpeg.",
};

export default function VideoToGifPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Video to GIF</h1>
        <p className="text-muted-foreground">
          Convert short MP4 or WebM videos into animated GIFs locally. 
          Powered by WebAssembly FFmpeg. No files are uploaded to any server.
        </p>
      </div>
      <VideoToGifClient />
    </div>
  );
}
