import { Metadata } from "next";
import { OnlineNotepadClient } from "./client";

export const metadata: Metadata = {
  title: "Online Notepad (Autosave)",
  description: "A simple, distraction-free online notepad that autosaves your text locally in your browser. No login required.",
};

export default function OnlineNotepadPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Online Notepad</h1>
        <p className="text-muted-foreground">
          A secure, fast, and distraction-free notepad. Everything you type is automatically saved to your local browser storage so you never lose your work.
        </p>
      </div>
      <OnlineNotepadClient />
    </div>
  );
}
