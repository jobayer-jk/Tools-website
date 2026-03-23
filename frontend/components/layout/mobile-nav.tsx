"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, ChevronDown, ArrowUpRight,
  Wrench, Home, LayoutGrid,
} from "lucide-react";
import { toolCategories } from "@/lib/tools-registry";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   MobileNav
───────────────────────────────────────────────────────────────────────────── */
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  /* lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* close on route change */
  useEffect(() => {
    setOpen(false);
    setExpandedCat(null);
  }, [pathname]);

  const close = () => { setOpen(false); setExpandedCat(null); };

  return (
    <>
      {/* ── Styles ──────────────────────────────────────────────────────── */}
      <style>{`
        /* ── tokens (matches navbar) ───────────────────────────────── */
        :root {
          --mn-bg:        #ffffff;
          --mn-surface:   #ffffff;
          --mn-surface-2: #f4f5f9;
          --mn-border:    rgba(0,0,0,0.05);
          --mn-text:      #334155;
          --mn-text-2:    rgba(51,65,85,0.7);
          --mn-text-3:    rgba(51,65,85,0.4);
          --mn-accent:    #4f46e5;
          --mn-accent-rgb:79,70,229;
          --mn-accent-s:  rgba(79,70,229,0.08);
          --mn-font-d:    'Syne', sans-serif;
          --mn-font-b:    'Manrope', sans-serif;
          --mn-ease:      0.22s cubic-bezier(0.4,0,0.2,1);
        }
        .dark {
          --mn-bg:        #0d0e1a;
          --mn-surface:   #0d0e1a;
          --mn-surface-2: #13152a;
          --mn-border:    rgba(255,255,255,0.07);
          --mn-text:      #ffffff;
          --mn-text-2:    rgba(255,255,255,0.7);
          --mn-text-3:    rgba(255,255,255,0.4);
          --mn-accent:    #6366f1;
          --mn-accent-rgb:99,102,241;
          --mn-accent-s:  rgba(99,102,241,0.10);
        }

        /* ── Trigger button ────────────────────────────────────────── */
        .mn-trigger {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 9px;
          border: 1px solid var(--mn-border);
          background: var(--mn-surface-2);
          color: var(--mn-text); cursor: pointer;
          transition: background var(--mn-ease), border-color var(--mn-ease),
                      transform var(--mn-ease);
          flex-shrink: 0;
        }
        .mn-trigger:hover {
          background: var(--mn-surface);
          border-color: rgba(var(--mn-accent-rgb), 0.3);
          transform: scale(1.04);
        }

        /* ── Backdrop ──────────────────────────────────────────────── */
        .mn-backdrop {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.38);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          opacity: 0; pointer-events: none;
          transition: opacity 0.28s ease;
        }
        .mn-backdrop.open { opacity: 1; pointer-events: auto; }

        /* ── Drawer ────────────────────────────────────────────────── */
        .mn-drawer {
          position: fixed; top: 0; right: 0; bottom: 0; z-index: 210;
          width: min(310px, 90vw);
          background: var(--mn-surface);
          border-left: 1px solid var(--mn-border);
          display: flex; flex-direction: column;
          transform: translateX(110%);
          transition: transform 0.32s cubic-bezier(0.16,1,0.3,1);
          box-shadow: -8px 0 40px rgba(0,0,0,0.15);
          font-family: var(--mn-font-b);
        }
        .dark .mn-drawer { box-shadow: -8px 0 40px rgba(0,0,0,0.55); }
        .mn-drawer.open { transform: translateX(0); }

        /* ── Drawer head ───────────────────────────────────────────── */
        .mn-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px; border-bottom: 1px solid var(--mn-border);
          flex-shrink: 0;
        }
        .mn-logo {
          display: flex; align-items: center; gap: 8px; text-decoration: none;
        }
        .mn-logo-icon {
          width: 28px; height: 28px; border-radius: 7px;
          background: var(--mn-accent);
          display: flex; align-items: center; justify-content: center;
          color: #fff; flex-shrink: 0;
        }
        .mn-logo-name {
          font-family: var(--mn-font-d);
          font-size: 14px; font-weight: 700;
          color: var(--mn-text); letter-spacing: -0.01em;
        }
        .mn-close {
          width: 30px; height: 30px; border-radius: 8px;
          border: 1px solid var(--mn-border);
          background: var(--mn-surface-2);
          display: flex; align-items: center; justify-content: center;
          color: var(--mn-text-2); cursor: pointer;
          transition: background var(--mn-ease), color var(--mn-ease);
        }
        .mn-close:hover { background: var(--mn-surface); color: var(--mn-text); }

        /* ── Drawer body ───────────────────────────────────────────── */
        .mn-body { flex: 1; overflow-y: auto; padding: 10px 10px 12px; }
        .mn-body::-webkit-scrollbar { width: 3px; }
        .mn-body::-webkit-scrollbar-track { background: transparent; }
        .mn-body::-webkit-scrollbar-thumb {
          background: var(--mn-border); border-radius: 9999px;
        }

        /* ── Section group ─────────────────────────────────────────── */
        .mn-group { margin-bottom: 4px; }
        .mn-group-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.10em;
          text-transform: uppercase; color: var(--mn-text-3);
          padding: 8px 10px 4px;
        }

        /* ── Plain nav link ────────────────────────────────────────── */
        .mn-nav-link {
          display: flex; align-items: center; gap: 9px;
          padding: 9px 11px; border-radius: 9px;
          font-size: 14px; font-weight: 600; color: var(--mn-text-2);
          text-decoration: none;
          transition: background var(--mn-ease), color var(--mn-ease);
        }
        .mn-nav-link:hover { background: var(--mn-surface-2); color: var(--mn-text); }
        .mn-nav-link.active {
          background: var(--mn-accent-s); color: var(--mn-accent);
        }
        .mn-nav-link-icon {
          width: 26px; height: 26px; border-radius: 7px;
          background: var(--mn-surface-2);
          display: flex; align-items: center; justify-content: center;
          color: var(--mn-text-3); flex-shrink: 0;
          transition: background var(--mn-ease), color var(--mn-ease);
        }
        .mn-nav-link:hover .mn-nav-link-icon,
        .mn-nav-link.active .mn-nav-link-icon {
          background: rgba(var(--mn-accent-rgb), 0.12);
          color: var(--mn-accent);
        }

        /* ── Divider ───────────────────────────────────────────────── */
        .mn-divider {
          height: 1px; background: var(--mn-border);
          margin: 6px 0; border: none;
        }

        /* ── Category accordion ────────────────────────────────────── */
        .mn-cat { }
        .mn-cat-btn {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 9px 11px; border-radius: 9px;
          background: transparent; border: none; cursor: pointer;
          text-align: left; font-family: var(--mn-font-b);
          transition: background var(--mn-ease);
        }
        .mn-cat-btn:hover { background: var(--mn-surface-2); }
        .mn-cat-btn.open { background: var(--mn-surface-2); }
        .mn-cat-left {
          display: flex; align-items: center; gap: 9px;
        }
        .mn-cat-icon {
          width: 26px; height: 26px; border-radius: 7px;
          background: var(--mn-surface-2);
          display: flex; align-items: center; justify-content: center;
          color: var(--mn-text-3); flex-shrink: 0;
          transition: background var(--mn-ease), color var(--mn-ease);
        }
        .mn-cat-btn.open .mn-cat-icon,
        .mn-cat-btn:hover .mn-cat-icon {
          background: rgba(var(--mn-accent-rgb), 0.10);
          color: var(--mn-accent);
        }
        .mn-cat-name {
          font-size: 13.5px; font-weight: 600; color: var(--mn-text-2);
          transition: color var(--mn-ease);
        }
        .mn-cat-btn:hover .mn-cat-name,
        .mn-cat-btn.open .mn-cat-name { color: var(--mn-text); }
        .mn-cat-count {
          font-size: 11px; font-weight: 500; color: var(--mn-text-3);
          margin-left: 4px;
        }
        .mn-chevron {
          color: var(--mn-text-3); flex-shrink: 0;
          transition: transform var(--mn-ease), color var(--mn-ease);
        }
        .mn-cat-btn.open .mn-chevron {
          transform: rotate(180deg); color: var(--mn-accent);
        }

        /* ── Tool list (accordion body) ────────────────────────────── */
        .mn-tools {
          overflow: hidden; max-height: 0;
          transition: max-height 0.28s cubic-bezier(0.4,0,0.2,1);
          padding-left: 12px;
        }
        .mn-tools.open { max-height: 500px; }
        .mn-tools-inner { padding: 3px 0 4px; }

        .mn-tool-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 7px 10px; border-radius: 8px;
          font-size: 13px; font-weight: 500; color: var(--mn-text-2);
          text-decoration: none;
          transition: background var(--mn-ease), color var(--mn-ease);
        }
        .mn-tool-link:hover { background: var(--mn-surface-2); color: var(--mn-text); }
        .mn-tool-link.active { color: var(--mn-accent); font-weight: 600; }
        .mn-tool-link-right {
          display: flex; align-items: center; gap: 5px; flex-shrink: 0;
        }
        .mn-new {
          font-size: 9px; font-weight: 700; letter-spacing: 0.05em;
          text-transform: uppercase; padding: 1px 5px; border-radius: 4px;
          background: rgba(var(--mn-accent-rgb), 0.10);
          color: var(--mn-accent);
        }

        .mn-view-all {
          display: flex; align-items: center; justify-content: space-between;
          padding: 7px 10px; border-radius: 8px; margin-top: 2px;
          font-size: 12.5px; font-weight: 600; color: var(--mn-accent);
          text-decoration: none;
          border-top: 1px solid var(--mn-border); padding-top: 8px; margin-top: 4px;
          transition: background var(--mn-ease);
        }
        .mn-view-all:hover { background: var(--mn-accent-s); }

        /* ── Footer ────────────────────────────────────────────────── */
        .mn-foot {
          border-top: 1px solid var(--mn-border);
          padding: 12px 18px;
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }
        .mn-foot-label {
          font-size: 12px; font-weight: 500; color: var(--mn-text-2);
        }
      `}</style>

      {/* ── Trigger ─────────────────────────────────────────────────────── */}
      <button
        className="mn-trigger md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={17} />
      </button>

      {/* ── Backdrop ────────────────────────────────────────────────────── */}
      <div
        className={cn("mn-backdrop", open && "open")}
        onClick={close}
        aria-hidden="true"
      />

      {/* ── Drawer ──────────────────────────────────────────────────────── */}
      <div
        className={cn("mn-drawer", open && "open")}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Head */}
        <div className="mn-head">
          <Link href="/" className="mn-logo" onClick={close}>
            <div className="mn-logo-icon">
              <Wrench size={13} />
            </div>
            <span className="mn-logo-name">Web Tools Hub</span>
          </Link>
          <button className="mn-close" onClick={close} aria-label="Close menu">
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="mn-body">

          {/* Main links */}
          <div className="mn-group">
            <div className="mn-group-label">Menu</div>

            <Link
              href="/"
              className={cn("mn-nav-link", pathname === "/" && "active")}
              onClick={close}
            >
              <span className="mn-nav-link-icon"><Home size={13} /></span>
              Home
            </Link>

            <Link
              href="/categories"
              className={cn("mn-nav-link", pathname === "/categories" && "active")}
              onClick={close}
            >
              <span className="mn-nav-link-icon"><LayoutGrid size={13} /></span>
              All Tools
            </Link>
          </div>

          <hr className="mn-divider" />

          {/* Categories */}
          <div className="mn-group">
            <div className="mn-group-label">Categories</div>

            {toolCategories.map((cat) => {
              const Icon = cat.icon;
              const isExpanded = expandedCat === cat.slug;
              return (
                <div key={cat.slug} className="mn-cat">
                  <button
                    className={cn("mn-cat-btn", isExpanded && "open")}
                    onClick={() =>
                      setExpandedCat(isExpanded ? null : cat.slug)
                    }
                    aria-expanded={isExpanded}
                  >
                    <div className="mn-cat-left">
                      <span className="mn-cat-icon"><Icon size={13} /></span>
                      <span className="mn-cat-name">
                        {cat.name}
                        <span className="mn-cat-count">
                          &nbsp;·&nbsp;{cat.tools.length}
                        </span>
                      </span>
                    </div>
                    <ChevronDown size={13} className="mn-chevron" />
                  </button>

                  <div className={cn("mn-tools", isExpanded && "open")}>
                    <div className="mn-tools-inner">
                      {cat.tools.slice(0, 5).map((tool) => (
                        <Link
                          key={tool.slug}
                          href={tool.path}
                          className={cn(
                            "mn-tool-link",
                            pathname === tool.path && "active"
                          )}
                          onClick={close}
                        >
                          <span>{tool.name}</span>
                          <span className="mn-tool-link-right">
                            {tool.isNew && (
                              <span className="mn-new">New</span>
                            )}
                          </span>
                        </Link>
                      ))}

                      {cat.tools.length > 5 && (
                        <Link
                          href={`/category/${cat.slug}`}
                          className="mn-view-all"
                          onClick={close}
                        >
                          <span>View all {cat.tools.length} tools</span>
                          <ArrowUpRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mn-foot">
          <span className="mn-foot-label">Switch theme</span>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}