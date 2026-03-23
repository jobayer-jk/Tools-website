import { Metadata } from "next";
import { PasswordGeneratorClient } from "./client";

export const metadata: Metadata = {
  title: "Strong Password Generator",
  description: "Generate highly secure, random passwords instantly. Create unbreakable passwords up to 128 characters with custom rules for uppercase, lowercase, numbers, and symbols.",
};

export default function PasswordGeneratorPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Strong Password Generator</h1>
        <p className="text-muted-foreground">
          Create secure, random passwords that are impossible to crack. Your passwords are generated locally in your browser and are never sent to any server.
        </p>
      </div>
      <PasswordGeneratorClient />
    </div>
  );
}
