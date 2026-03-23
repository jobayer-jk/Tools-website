import { Metadata } from "next";
import { UrlEncoderClient } from "./client";

export const metadata: Metadata = {
  title: "URL Encoder/Decoder",
  description: "Safely encode or decode URLs and parameters. Convert special characters to URL-safe format instantly.",
};

export default function UrlEncoderPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">URL Encoder / Decoder</h1>
        <p className="text-muted-foreground">
          Convert special characters into a URL-safe format or decode encoded URLs back to their original state.
        </p>
      </div>
      <UrlEncoderClient />
    </div>
  );
}
