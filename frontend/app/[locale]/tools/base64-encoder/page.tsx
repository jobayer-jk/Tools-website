import { Metadata } from "next";
import { Base64Client } from "./client";

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder",
  description: "Securely encode and decode text to Base64 format locally in your browser. No data is sent to external servers.",
};

export default function Base64Page() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Base64 Encoder/Decoder</h1>
        <p className="text-muted-foreground">
          Instantly transform text and strings into Base64 encoded format or decode them back. Everything runs locally in your browser for absolute privacy.
        </p>
      </div>
      <Base64Client />
    </div>
  );
}
