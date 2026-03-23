import { Metadata } from "next";
import { CaseConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Case Converter",
  description: "Convert text between uppercase, lowercase, title case, sentence case, and more instantly in your browser.",
};

export default function CaseConverterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Case Converter</h1>
        <p className="text-muted-foreground">
          Instantly transform your text into various text cases. Great for formatting titles, standardizing data, or just playing around with alternating case.
        </p>
      </div>
      <CaseConverterClient />
    </div>
  );
}
