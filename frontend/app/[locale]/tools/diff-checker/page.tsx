import { Metadata } from "next";
import { DiffCheckerClient } from "./client";

export const metadata: Metadata = {
  title: "Text Diff Checker",
  description: "Compare two pieces of text and instantly see the differences. A fast, free, and secure way to check for changes locally in your browser.",
};

export default function DiffCheckerPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Text Diff Checker</h1>
        <p className="text-muted-foreground">
          Compare original and modified texts line-by-line to see exactly what changed. Processing is instant and secure strictly within your browser.
        </p>
      </div>
      <DiffCheckerClient />
    </div>
  );
}
