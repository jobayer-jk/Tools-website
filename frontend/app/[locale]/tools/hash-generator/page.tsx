import { Metadata } from "next";
import { HashGeneratorClient } from "./client";

export const metadata: Metadata = {
  title: "Hash Generator (MD5, SHA-256)",
  description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly in your browser. Fully secure client-side processing.",
};

export default function HashGeneratorPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Hash Generator</h1>
        <p className="text-muted-foreground">
          Generate secure hashes instantly. Your text is never sent to a server; all cryptographic operations happen securely inside your browser.
        </p>
      </div>
      <HashGeneratorClient />
    </div>
  );
}
