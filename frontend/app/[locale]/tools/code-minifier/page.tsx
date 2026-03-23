import { Metadata } from "next";
import { CodeMinifierClient } from "./client";

export const metadata: Metadata = {
  title: "HTML/CSS/JS Minifier & Beautifier",
  description: "Minify or beautify your HTML, CSS, and JavaScript code instantly in your browser to improve load times.",
};

export default function CodeMinifierPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Code Minifier & Beautifier</h1>
        <p className="text-muted-foreground">
          Optimize your code for production by removing whitespace and comments, or format minified code to make it readable. All processing happens locally.
        </p>
      </div>
      <CodeMinifierClient />
    </div>
  );
}
