import { Metadata } from "next";
import { ContentGeneratorClient } from "./client";

export const metadata: Metadata = {
  title: "AI Content Generator (BYOK)",
  description: "Generate emails, blogs, or code snippets dynamically by bringing your own OpenAI API key. Zero server cost.",
};

export default function ContentGeneratorPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Content Generator</h1>
        <p className="text-muted-foreground">
          A purely client-side AI assistant. Bring Your Own Key (BYOK)—your API key is saved securely in your browser's local storage and used to communicate directly with OpenAI. We never see your prompts or your keys.
        </p>
      </div>
      <ContentGeneratorClient />
    </div>
  );
}
