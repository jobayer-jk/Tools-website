"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { toolCategories } from "@/lib/tools-registry";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
interface SiteSettings {
  siteName: string;
  siteLogoUrl: string | null;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Navbar
───────────────────────────────────────────────────────────────────────────── */
export function Navbar() {
  const pathname = usePathname();

  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Web Tools Hub",
    siteLogoUrl: null,
  });
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  /* fetch site settings */
  useEffect(() => {
    const load = () =>
      fetch("http://localhost:3001/settings/public", { cache: "no-store" })
        .then((r) => r.json())
        .then(setSettings)
        .catch(() => { });
    load();
    window.addEventListener("settingsUpdated", load);
    return () => window.removeEventListener("settingsUpdated", load);
  }, []);

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close dropdown when clicking outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* close mobile menu on route change */
  useEffect(() => { setMobileOpen(false); setOpenMenu(null); }, [pathname]);

  if (pathname?.includes("/dashboard") || pathname?.includes("/login") || pathname?.includes("/register")) return null;

  const navLinks = toolCategories.slice(0, 4);

  return (
    <>
      {/* ── Global styles ─────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

        /* light tokens */
        :root {
          --nb-bg:        #D97706;
          --nb-border:    #D97706;
          --nb-text:      #ffffff;
          --nb-text-2:    #ffffff;
          --nb-surface:   #D97706;
          --nb-surface-2: rgba(255,255,255,0.15);
          --nb-accent:    #ffffff;
          --nb-accent-rgb:255,255,255;
          --nb-accent-s:  rgba(255,255,255,0.2);
          --nb-shadow:    0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);
          --nb-font-d:    'Syne', sans-serif;
          --nb-font-b:    'Manrope', sans-serif;
          --nb-ease:      0.22s cubic-bezier(0.4,0,0.2,1);
        }
        /* dark tokens */
        .dark {
          --nb-bg:        #0d0e1a;
          --nb-border:    rgba(255,255,255,0.07);
          --nb-text:      #ffffff;
          --nb-text-2:    rgba(255,255,255,0.7);
          --nb-surface:   #0d0e1a;
          --nb-surface-2: #13152a;
          --nb-accent:    #6366f1;
          --nb-accent-rgb:99,102,241;
          --nb-accent-s:  rgba(99,102,241,0.10);
          --nb-shadow:    0 1px 2px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.5);
        }

        /* ── Shell ───────────────────────────────────────────────────── */
        .nb {
          position: sticky; top: 0; z-index: 100; width: 100%;
          font-family: var(--nb-font-b);
          background: var(--nb-bg);
          border-bottom: 1px solid var(--nb-border);
          transition: border-color var(--nb-ease), box-shadow var(--nb-ease);
        }
        .nb.scrolled {
        }

        /* ── Inner row ───────────────────────────────────────────────── */
        .nb-inner {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1200px; margin: 0 auto;
          padding: 0 24px; height: 56px; gap: 16px;
        }

        /* ── Logo ────────────────────────────────────────────────────── */
        .nb-logo {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; flex-shrink: 0;
          user-select: none;
        }
        .nb-logo-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: var(--nb-accent);
          display: flex; align-items: center; justify-content: center;
          color: #fff; flex-shrink: 0;
          transition: transform var(--nb-ease), box-shadow var(--nb-ease);
        }
        .nb-logo:hover .nb-logo-icon {
          transform: rotate(-8deg) scale(1.06);
          box-shadow: 0 4px 14px rgba(var(--nb-accent-rgb), 0.45);
        }
        .nb-logo-name {
          font-family: var(--nb-font-d);
          font-size: 15px; font-weight: 700;
          color: var(--nb-text); letter-spacing: -0.01em;
          transition: color var(--nb-ease);
        }

        /* ── Desktop nav ─────────────────────────────────────────────── */
        .nb-nav {
          display: flex; align-items: center; gap: 2px;
          flex: 1; justify-content: center;
        }
        @media (max-width: 767px) { .nb-nav { display: none; } }

        /* ── Nav link ────────────────────────────────────────────────── */
        .nb-link {
          position: relative; display: inline-flex; align-items: center;
          gap: 4px; padding: 6px 11px; border-radius: 8px;
          font-size: 13.5px; font-weight: 600;
          color: var(--nb-text-2); text-decoration: none; border: none;
          background: transparent; cursor: pointer; white-space: nowrap;
          transition: color var(--nb-ease), background var(--nb-ease);
          outline: none; font-family: var(--nb-font-b);
        }
        .nb-link:hover, .nb-link.active {
          color: var(--nb-text); background: var(--nb-surface-2);
        }
        .nb-link.active::after {
          content: ''; position: absolute; bottom: 3px; left: 50%;
          transform: translateX(-50%);
          width: 16px; height: 2px; border-radius: 2px;
          background: var(--nb-accent);
        }
        .nb-link-chevron {
          transition: transform var(--nb-ease);
          flex-shrink: 0; opacity: 0.6;
        }
        .nb-link.open .nb-link-chevron { transform: rotate(180deg); opacity: 1; }

        /* ── Dropdown ────────────────────────────────────────────────── */
        .nb-drop-wrap {
          position: relative;
        }
        .nb-drop {
          position: absolute; top: calc(100% + 8px); left: 50%;
          transform: translateX(-50%) translateY(6px) scale(0.97);
          width: 260px;
          background: var(--nb-surface);
          border: 1px solid var(--nb-border);
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
          padding: 6px;
          opacity: 0; pointer-events: none;
          transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.16,1,0.3,1);
          z-index: 200;
        }
        .dark .nb-drop {
          box-shadow: 0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4);
        }
        .nb-drop.open {
          opacity: 1; pointer-events: auto;
          transform: translateX(-50%) translateY(0) scale(1);
        }

        /* ── Drop header ─────────────────────────────────────────────── */
        .nb-drop-head {
          padding: 8px 10px 6px;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.09em; text-transform: uppercase;
          color: var(--nb-text-2); border-bottom: 1px solid var(--nb-border);
          margin-bottom: 4px;
        }

        /* ── Drop item ───────────────────────────────────────────────── */
        .nb-drop-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 8px 10px; border-radius: 9px;
          text-decoration: none;
          transition: background var(--nb-ease);
        }
        .nb-drop-item:hover { background: var(--nb-surface-2); }
        .nb-drop-item-name {
          font-size: 13px; font-weight: 600; color: var(--nb-text);
          line-height: 1.3; display: flex; align-items: center; gap: 5px;
        }
        .nb-drop-item-desc {
          font-size: 11.5px; color: var(--nb-text-2); line-height: 1.45; margin-top: 1px;
          overflow: hidden; display: -webkit-box;
          -webkit-line-clamp: 1; -webkit-box-orient: vertical;
        }
        .nb-new-badge {
          font-size: 9px; font-weight: 700; letter-spacing: 0.05em;
          text-transform: uppercase; padding: 1px 5px; border-radius: 4px;
          background: rgba(var(--nb-accent-rgb), 0.12);
          color: var(--nb-accent); flex-shrink: 0;
        }

        /* ── Drop footer link ────────────────────────────────────────── */
        .nb-drop-all {
          display: flex; align-items: center; justify-content: space-between;
          padding: 7px 10px; margin-top: 4px; border-radius: 9px;
          border-top: 1px solid var(--nb-border); padding-top: 10px;
          font-size: 12.5px; font-weight: 600;
          color: var(--nb-accent); text-decoration: none;
          transition: background var(--nb-ease);
        }
        .nb-drop-all:hover { background: var(--nb-accent-s); }

        /* ── Right slot ──────────────────────────────────────────────── */
        .nb-right {
          display: flex; align-items: center; gap: 6px; flex-shrink: 0;
        }

        /* ── Theme toggle wrapper ────────────────────────────────────── */
        .nb-theme { display: flex; }
        @media (max-width: 767px) { .nb-theme { display: none; } }

        /* ── Mobile hamburger ────────────────────────────────────────── */
        .nb-burger {
          display: none; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 9px;
          border: 1px solid var(--nb-border);
          background: var(--nb-surface-2);
          color: var(--nb-text); cursor: pointer;
          transition: background var(--nb-ease), border-color var(--nb-ease);
        }
        .nb-burger:hover { background: var(--nb-surface); border-color: rgba(var(--nb-accent-rgb),0.3); }
        @media (max-width: 767px) { .nb-burger { display: flex; } }

        /* ── Mobile drawer ───────────────────────────────────────────── */
        .nb-mobile-overlay {
          position: fixed; inset: 0; z-index: 90;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(4px);
          opacity: 0; pointer-events: none;
          transition: opacity 0.25s ease;
        }
        .nb-mobile-overlay.open { opacity: 1; pointer-events: auto; }

        .nb-mobile-drawer {
          position: fixed; top: 0; right: 0; bottom: 0; z-index: 95;
          width: min(320px, 88vw);
          background: var(--nb-surface);
          border-left: 1px solid var(--nb-border);
          display: flex; flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
          overflow-y: auto;
        }
        .nb-mobile-drawer.open { transform: translateX(0); }

        .nb-mob-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--nb-border);
          flex-shrink: 0;
        }
        .nb-mob-close {
          width: 32px; height: 32px; border-radius: 8px;
          border: 1px solid var(--nb-border);
          background: var(--nb-surface-2);
          display: flex; align-items: center; justify-content: center;
          color: var(--nb-text-2); cursor: pointer;
          transition: background var(--nb-ease);
        }
        .nb-mob-close:hover { background: var(--nb-surface); color: var(--nb-text); }

        .nb-mob-body { flex: 1; padding: 12px 12px 20px; }

        .nb-mob-section { margin-bottom: 6px; }
        .nb-mob-sec-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.09em;
          text-transform: uppercase; color: var(--nb-text-2);
          padding: 8px 10px 4px;
        }

        .nb-mob-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 9px 12px; border-radius: 10px;
          font-size: 14px; font-weight: 600; color: var(--nb-text);
          text-decoration: none;
          transition: background var(--nb-ease);
        }
        .nb-mob-link:hover, .nb-mob-link.active {
          background: var(--nb-surface-2); color: var(--nb-accent);
        }

        .nb-mob-cat { margin-bottom: 2px; }
        .nb-mob-cat-btn {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 9px 12px; border-radius: 10px;
          font-size: 13.5px; font-weight: 600; color: var(--nb-text-2);
          background: transparent; border: none; cursor: pointer;
          text-align: left; font-family: var(--nb-font-b);
          transition: background var(--nb-ease), color var(--nb-ease);
        }
        .nb-mob-cat-btn:hover { background: var(--nb-surface-2); color: var(--nb-text); }
        .nb-mob-cat-chevron { transition: transform var(--nb-ease); opacity: 0.5; }
        .nb-mob-cat-btn.open .nb-mob-cat-chevron { transform: rotate(180deg); opacity: 1; }

        .nb-mob-tools {
          padding: 4px 0 4px 12px; overflow: hidden;
          max-height: 0;
          transition: max-height 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .nb-mob-tools.open { max-height: 400px; }

        .nb-mob-tool-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 7px 10px; border-radius: 8px;
          font-size: 13px; font-weight: 500; color: var(--nb-text-2);
          text-decoration: none;
          transition: background var(--nb-ease), color var(--nb-ease);
        }
        .nb-mob-tool-link:hover { background: var(--nb-surface-2); color: var(--nb-text); }

        .nb-mob-footer {
          padding: 14px 20px;
          border-top: 1px solid var(--nb-border);
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }
        .nb-mob-footer-text {
          font-size: 12px; color: var(--nb-text-2); font-weight: 500;
        }
      `}</style>

      {/* ── Navbar shell ───────────────────────────────────────────────── */}
      <header className={cn("nb", scrolled && "scrolled")}>
        <div className="nb-inner" ref={navRef}>

          {/* Logo */}
          <Link href="/" className="nb-logo">
            {settings.siteLogoUrl && (
              <img
                src={`http://localhost:3001${settings.siteLogoUrl}`}
                alt={settings.siteName}
                style={{ height: 42, maxWidth: 180, objectFit: "contain" }}
              />
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="nb-nav">
            <Link
              href="/"
              className={cn("nb-link", pathname === "/" && "active")}
            >
              Home
            </Link>

            {navLinks.map((cat) => {
              const isOpen = openMenu === cat.slug;
              return (
                <div key={cat.slug} className="nb-drop-wrap">
                  <button
                    className={cn("nb-link", isOpen && "open")}
                    onClick={() => setOpenMenu(isOpen ? null : cat.slug)}
                    onMouseEnter={() => setOpenMenu(cat.slug)}
                    onMouseLeave={() => setOpenMenu(null)}
                    aria-expanded={isOpen}
                  >
                    {cat.name}
                    <ChevronDown size={13} className="nb-link-chevron" />
                  </button>

                  {/* Dropdown */}
                  <div
                    className={cn("nb-drop", isOpen && "open")}
                    onMouseEnter={() => setOpenMenu(cat.slug)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <div className="nb-drop-head">{cat.name}</div>

                    {cat.tools.slice(0, 5).map((tool) => (
                      <Link
                        key={tool.slug}
                        href={tool.path}
                        className="nb-drop-item"
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="nb-drop-item-name">
                            {tool.name}
                            {tool.isNew && (
                              <span className="nb-new-badge">New</span>
                            )}
                          </div>
                          <div className="nb-drop-item-desc">
                            {tool.description}
                          </div>
                        </div>
                      </Link>
                    ))}

                    {cat.tools.length > 5 && (
                      <Link
                        href={`/category/${cat.slug}`}
                        className="nb-drop-all"
                      >
                        <span>All {cat.tools.length} tools</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}

            <Link
              href="/categories"
              className={cn(
                "nb-link",
                pathname === "/categories" && "active"
              )}
            >
              All Tools
            </Link>
          </nav>

          {/* Right slot */}
          <div className="nb-right">
            <div className="nb-theme">
              <ThemeToggle />
            </div>

            {/* Mobile hamburger */}
            <button
              className="nb-burger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={17} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile overlay ──────────────────────────────────────────────── */}
      <div
        className={cn("nb-mobile-overlay", mobileOpen && "open")}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Mobile drawer ───────────────────────────────────────────────── */}
      <div className={cn("nb-mobile-drawer", mobileOpen && "open")}>
        {/* Header */}
        <div className="nb-mob-head">
          <Link href="/" className="nb-logo" onClick={() => setMobileOpen(false)}>
            {settings.siteLogoUrl && (
              <img
                src={`http://localhost:3001${settings.siteLogoUrl}`}
                alt={settings.siteName}
                style={{ height: 32, maxWidth: 160, objectFit: "contain" }}
              />
            )}
          </Link>
          <button
            className="nb-mob-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="nb-mob-body">

          {/* Main links */}
          <div className="nb-mob-section">
            <div className="nb-mob-sec-label">Navigation</div>
            <Link
              href="/"
              className={cn("nb-mob-link", pathname === "/" && "active")}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className={cn("nb-mob-link", pathname === "/categories" && "active")}
            >
              All Tools
              <ArrowUpRight size={13} style={{ opacity: 0.4 }} />
            </Link>
          </div>

          {/* Category accordions */}
          <div className="nb-mob-section">
            <div className="nb-mob-sec-label">Categories</div>
            <MobileCategoryAccordions
              categories={navLinks}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="nb-mob-footer">
          <span className="nb-mob-footer-text">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Mobile category accordions (internal)
───────────────────────────────────────────────────────────────────────────── */
function MobileCategoryAccordions({
  categories,
  onNavigate,
}: {
  categories: typeof toolCategories;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      {categories.map((cat) => {
        const isOpen = open === cat.slug;
        return (
          <div key={cat.slug} className="nb-mob-cat">
            <button
              className={cn("nb-mob-cat-btn", isOpen && "open")}
              onClick={() => setOpen(isOpen ? null : cat.slug)}
            >
              {cat.name}
              <ChevronDown size={14} className="nb-mob-cat-chevron" />
            </button>

            <div className={cn("nb-mob-tools", isOpen && "open")}>
              {cat.tools.slice(0, 5).map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.path}
                  className="nb-mob-tool-link"
                  onClick={onNavigate}
                >
                  <span>{tool.name}</span>
                  {tool.isNew && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
                      padding: "1px 5px", borderRadius: 4,
                      background: "var(--nb-accent-s)", color: "var(--nb-accent)",
                    }}>
                      NEW
                    </span>
                  )}
                </Link>
              ))}
              {cat.tools.length > 5 && (
                <Link
                  href={`/category/${cat.slug}`}
                  className="nb-mob-tool-link"
                  onClick={onNavigate}
                  style={{ color: "var(--nb-accent)", fontWeight: 600 }}
                >
                  All {cat.tools.length} tools
                  <ArrowUpRight size={12} />
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}