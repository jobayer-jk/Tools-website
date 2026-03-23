import { Metadata } from "next";
import { JsonFormatterClient } from "./client";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator",
  description: "Format, beautify, minify, and validate JSON data instantly in your browser. 100% free and secure.",
};

export default function JsonFormatterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">JSON Formatter & Validator</h1>
        <p className="text-muted-foreground">
          Format and validate your JSON strings instantly. Everything happens locally in your browser so your raw data remains entirely private.
        </p>
      </div>
      <JsonFormatterClient />
    </div>
  );
}
