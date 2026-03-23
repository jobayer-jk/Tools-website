import { Metadata } from "next";
import { DataConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Data Format Converter (CSV/JSON/XML)",
  description: "Convert instantly between CSV, JSON, and XML formats. Fast, secure, client-side data conversion.",
};

export default function DataConverterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Data Format Converter</h1>
        <p className="text-muted-foreground">
          Instantly convert raw data between CSV, JSON, and XML formats. 
          Everything runs entirely on your device, meaning your datasets remain completely private and secure.
        </p>
      </div>
      <DataConverterClient />
    </div>
  );
}
