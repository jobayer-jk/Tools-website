import { Metadata } from "next";
import { BackgroundRemoverClient } from "./client";

export const metadata: Metadata = {
  title: "AI Background Remover",
  description: "Remove backgrounds from images instantly using on-device AI. Free, private, no upload required.",
};

export default function BackgroundRemoverPage() {
  return (
    <>
      <style>{`
        .br-page {
          --em:       #059669;
          --em-rgb:   5,150,105;
          --em-s:     rgba(5,150,105,0.08);
          --warm:     #d97706;
          --bg:       var(--background);
          --font-d:   'Outfit', sans-serif;
          --font-b:   'DM Sans', sans-serif;
          padding: 28px 24px 60px;
          max-width: 1100px;
          margin: 0 auto;
          font-family: var(--font-b);
        }
        .dark .br-page {
          --em:     #10b981;
          --em-rgb: 16,185,129;
          --em-s:   rgba(16,185,129,0.10);
          --warm:   #f59e0b;
        }
        .br-page-head { margin-bottom: 28px; }
        .br-page-kicker {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 10.5px; font-weight: 700; letter-spacing: 0.10em;
          text-transform: uppercase; color: var(--em);
          margin-bottom: 8px;
        }
        .br-page-kicker::before {
          content: ''; width: 16px; height: 2px;
          background: var(--em); border-radius: 2px;
        }
        .br-page-title {
          font-family: var(--font-d);
          font-size: clamp(1.5rem, 3vw, 2.1rem);
          font-weight: 800; letter-spacing: -0.028em;
          color: var(--foreground); margin: 0 0 8px;
        }
        .br-page-desc {
          font-size: 14px; color: var(--muted-foreground);
          line-height: 1.65; margin: 0; max-width: 600px;
        }
        .br-badges {
          display: flex; align-items: center; flex-wrap: wrap;
          gap: 8px; margin-top: 14px;
        }
        .br-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 11px; border-radius: 9999px;
          font-size: 11.5px; font-weight: 600;
          background: var(--em-s);
          border: 1px solid rgba(var(--em-rgb),0.18);
          color: var(--em);
        }
        @media(max-width:640px) {
          .br-page { padding: 20px 14px 40px; }
          .br-page-title { font-size: 1.5rem; }
        }
      `}</style>

      <div className="br-page">
        <div className="br-page-head">
          <div className="br-page-kicker">AI Tool</div>
          <h1 className="br-page-title">Background Remover</h1>
          <p className="br-page-desc">
            Upload any image and let on-device AI extract the foreground in seconds.
            Everything runs in your browser - your images never leave your device.
          </p>
          <div className="br-badges">
            <span className="br-badge">100% Private</span>
            <span className="br-badge">No Upload</span>
            <span className="br-badge">Free Forever</span>
            <span className="br-badge">Works Offline</span>
          </div>
        </div>

        <BackgroundRemoverClient />
      </div>
    </>
  );
}