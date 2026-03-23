import Link from "next/link";
import { Wrench, Github, Twitter, ArrowUpRight, Zap, Shield, Sparkles } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   Footer — server component, matches navbar/page design system
───────────────────────────────────────────────────────────────────────────── */
export async function Footer() {
  let settings = { siteName: "", siteLogoUrl: null as string | null };
  try {
    const res = await fetch("http://localhost:3001/settings/public", {
      cache: "no-store",
    });
    if (res.ok) settings = await res.json();
  } catch {
    /* fall through to defaults */
  }

  const year = new Date().getFullYear();

  const topTools = [
    { label: "Password Generator", href: "/tools/password-generator" },
    { label: "Image Resizer", href: "/tools/image-resizer" },
    { label: "QR Code Generator", href: "/tools/qr-generator" },
    { label: "PDF Merger", href: "/tools/pdf-merger" },
    { label: "Word Counter", href: "/tools/word-counter" },
  ];

  const categories = [
    { label: "Utility & Dev", href: "/category/utility" },
    { label: "Image Tools", href: "/category/image" },
    { label: "PDF Tools", href: "/category/pdf" },
    { label: "Productivity", href: "/category/productivity" },
    { label: "All Categories", href: "/categories", highlight: true },
  ];

  const legal = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact Us", href: "/contact" },
    { label: "About Us", href: "/about" },
  ];

  const badges = [
    { icon: "zap", label: "Fast Processing" },
    { icon: "shield", label: "100% Private" },
    { icon: "sparkles", label: "Always Free" },
  ];

  return (
    <>
      {/* ── Styles ──────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

        /* ── Light tokens ──────────────────────────────────────────── */
        :root {
          --ft-bg:        #0e0e0eff;
          --ft-surface:   #0e0e0eff;
          --ft-surface-2: rgba(255,255,255,0.15);
          --ft-border:    rgba(255,255,255,0.15);
          --ft-text:      #ffffff;
          --ft-text-2:    #fffffff3;
          --ft-text-3:    #ffffff;
          --ft-accent:    #6366f1;
          --ft-accent-rgb:99,102,241;
          --ft-accent-s:  rgba(99,102,241,0.12);
          --ft-green:     #22c55e;
          --ft-amber:     #f59e0b;
          --ft-indigo:    #818cf8;
          --ft-font-d:    'Syne', sans-serif;
          --ft-font-b:    'Manrope', sans-serif;
          --ft-ease:      0.20s cubic-bezier(0.4,0,0.2,1);
        }

        /* ── Dark tokens ───────────────────────────────────────────── */
        .dark {
          --ft-bg:        #0d0e1a;
          --ft-surface:   #13152a;
          --ft-surface-2: #1a1d33;
          --ft-border:    rgba(255,255,255,0.07);
        }

        /* ── Shell ─────────────────────────────────────────────────── */
        .ft {
          background: var(--ft-bg);
          color: var(--ft-text);
          font-family: var(--ft-font-b);
          width: 100%;
        }

        /* ── Top strip ─────────────────────────────────────────────── */
        .ft-strip {
          border-bottom: 1px solid var(--ft-border);
          padding: 18px 0;
        }
        .ft-strip-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; flex-wrap: wrap;
          gap: 10px 28px; justify-content: center;
        }
        .ft-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600; color: var(--ft-text-2);
        }
        .ft-badge-sep {
          width: 1px; height: 14px;
          background: var(--ft-border); flex-shrink: 0;
        }

        /* ── Main grid ─────────────────────────────────────────────── */
        .ft-main {
          max-width: 1200px; margin: 0 auto; padding: 52px 24px 48px;
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1fr;
          gap: 40px;
        }
        @media (max-width: 1024px) {
          .ft-main { grid-template-columns: 1fr 1fr; gap: 36px 32px; }
        }
        @media (max-width: 560px) {
          .ft-main { grid-template-columns: 1fr 1fr; gap: 28px 20px; padding: 40px 16px 36px; }
          .ft-brand-col { grid-column: 1 / -1; }
          .ft-strip-inner { gap: 10px 16px; }
        }
        @media (max-width: 400px) {
          .ft-main { grid-template-columns: 1fr; }
          .ft-brand-col { grid-column: 1; }
        }

        /* ── Brand column ──────────────────────────────────────────── */
        .ft-brand-col { display: flex; flex-direction: column; gap: 16px; }
        .ft-logo {
          display: inline-flex; align-items: center; gap: 9px;
          text-decoration: none; width: fit-content;
        }
        .ft-logo-icon {
          width: 32px; height: 32px; border-radius: 9px;
          background: var(--ft-accent);
          display: flex; align-items: center; justify-content: center;
          color: #fff; flex-shrink: 0;
          transition: transform var(--ft-ease), box-shadow var(--ft-ease);
        }
        .ft-logo:hover .ft-logo-icon {
          transform: rotate(-8deg) scale(1.06);
          box-shadow: 0 4px 16px rgba(var(--ft-accent-rgb), 0.5);
        }
        .ft-logo-name {
          font-family: var(--ft-font-d);
          font-size: 15px; font-weight: 700;
          color: var(--ft-text); letter-spacing: -0.01em;
        }

        .ft-desc {
          font-size: 13px; line-height: 1.65;
          color: var(--ft-text-2); max-width: 260px;
        }

        /* ── Social row ────────────────────────────────────────────── */
        .ft-socials { display: flex; align-items: center; gap: 8px; }
        .ft-social {
          width: 34px; height: 34px; border-radius: 9px;
          border: 1px solid var(--ft-border);
          background: var(--ft-surface);
          display: flex; align-items: center; justify-content: center;
          color: var(--ft-text-2); text-decoration: none;
          transition: background var(--ft-ease), color var(--ft-ease),
                      border-color var(--ft-ease), transform var(--ft-ease);
        }
        .ft-social:hover {
          background: var(--ft-surface-2); color: var(--ft-text);
          border-color: rgba(var(--ft-accent-rgb), 0.35);
          transform: translateY(-2px);
        }

        /* ── Link column ───────────────────────────────────────────── */
        .ft-col { display: flex; flex-direction: column; gap: 0; }
        .ft-col-title {
          font-family: var(--ft-font-d);
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--ft-text); margin-bottom: 14px;
          display: flex; align-items: center; gap: 6px;
        }
        .ft-col-title::before {
          content: ''; width: 14px; height: 2px;
          background: var(--ft-accent); border-radius: 2px; flex-shrink: 0;
        }

        .ft-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 5px 0; font-size: 13px; font-weight: 500;
          color: var(--ft-text-2); text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: color var(--ft-ease), border-color var(--ft-ease);
          gap: 4px;
        }
        .ft-link:hover { color: var(--ft-text); }
        .ft-link.accent { color: var(--ft-indigo); }
        .ft-link.accent:hover { color: #a5b4fc; }
        .ft-link svg { flex-shrink: 0; opacity: 0; transition: opacity var(--ft-ease); }
        .ft-link:hover svg { opacity: 0.6; }

        /* ── Bottom bar ────────────────────────────────────────────── */
        .ft-bottom {
          border-top: 1px solid var(--ft-border);
          padding: 18px 24px;
        }
        .ft-bottom-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 8px;
        }
        .ft-copy {
          font-size: 12px; color: var(--ft-text-3); font-weight: 500;
        }
        .ft-copy span { color: var(--ft-text-2); }
        .ft-bottom-links {
          display: flex; align-items: center; gap: 16px;
        }
        .ft-bottom-link {
          font-size: 12px; color: var(--ft-text-3); font-weight: 500;
          text-decoration: none;
          transition: color var(--ft-ease);
        }
        .ft-bottom-link:hover { color: var(--ft-text-2); }
        @media (max-width: 480px) {
          .ft-bottom { padding: 16px; }
          .ft-bottom-inner { flex-direction: column; align-items: flex-start; gap: 10px; }
          .ft-bottom-links { gap: 12px; }
        }
      `}</style>

      <footer className="ft">

        {/* ── Top quality strip ───────────────────────────────────────────── */}
        <div className="ft-strip">
          <div className="ft-strip-inner">
            <div className="ft-badge">
              <Zap size={12} style={{ color: "var(--ft-amber)", flexShrink: 0 }} />
              Fast Processing
            </div>
            <div className="ft-badge-sep" />
            <div className="ft-badge">
              <Shield size={12} style={{ color: "var(--ft-green)", flexShrink: 0 }} />
              100% Private — runs in your browser
            </div>
            <div className="ft-badge-sep" />
            <div className="ft-badge">
              <Sparkles size={12} style={{ color: "var(--ft-indigo)", flexShrink: 0 }} />
              Always free, no sign-up
            </div>
          </div>
        </div>

        {/* ── Main columns ────────────────────────────────────────────────── */}
        <div className="ft-main">

          {/* Brand */}
          <div className="ft-brand-col">
            <Link href="/" className="ft-logo">
              {settings.siteLogoUrl && (
                <img
                  src={`http://localhost:3001${settings.siteLogoUrl}`}
                  alt={settings.siteName}
                  style={{ height: 42, maxWidth: 180, objectFit: "contain" }}
                />
              )}
            </Link>

            <p className="ft-desc">
              A comprehensive suite of free, fast, and privacy-focused online
              tools for developers and professionals.
            </p>

            <div className="ft-socials">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="ft-social"
                aria-label="GitHub"
              >
                <Github size={15} />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="ft-social"
                aria-label="Twitter / X"
              >
                <Twitter size={15} />
              </Link>
            </div>
          </div>

          {/* Top Tools */}
          <div className="ft-col">
            <div className="ft-col-title">Top Tools</div>
            {topTools.map((t) => (
              <Link key={t.href} href={t.href} className="ft-link">
                {t.label}
                <ArrowUpRight size={11} />
              </Link>
            ))}
          </div>

          {/* Categories */}
          <div className="ft-col">
            <div className="ft-col-title">Categories</div>
            {categories.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className={`ft-link${c.highlight ? " accent" : ""}`}
              >
                {c.label}
                <ArrowUpRight size={11} />
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div className="ft-col">
            <div className="ft-col-title">Company</div>
            {legal.map((l) => (
              <Link key={l.href} href={l.href} className="ft-link">
                {l.label}
                <ArrowUpRight size={11} />
              </Link>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────────────── */}
        <div className="ft-bottom">
          <div className="ft-bottom-inner">
            <p className="ft-copy">
              &copy; {year} <span>{settings.siteName}</span>. All rights reserved.
            </p>
            <div className="ft-bottom-links">
              <Link href="/privacy" className="ft-bottom-link">Privacy</Link>
              <Link href="/terms" className="ft-bottom-link">Terms</Link>
              <Link href="/contact" className="ft-bottom-link">Contact</Link>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
}