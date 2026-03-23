"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Search, Zap, Shield, Sparkles,
  ChevronRight, ArrowUpRight, Star,
  TrendingUp, Clock, Sun, Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toolCategories, getPopularTools, getNewTools } from "@/lib/tools-registry";
import { ToolCard } from "@/components/tools/tool-card";
import { useTranslations } from "next-intl";

/* ------------------------------------------------------------------
   Scroll-reveal hook
------------------------------------------------------------------ */
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ------------------------------------------------------------------
   Animated counter
------------------------------------------------------------------ */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useReveal();
  useEffect(() => {
    if (!visible) return;
    let n = 0;
    const id = setInterval(() => {
      n = Math.min(n + Math.ceil(to / 45), to);
      setVal(n);
      if (n >= to) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [visible, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ------------------------------------------------------------------
   Theme toggle
------------------------------------------------------------------ */
/* Removed ThemeBtn to prevent duplication with Navbar ThemeToggle */

/* ------------------------------------------------------------------
   Dot-grid SVG (hero background pattern)
------------------------------------------------------------------ */
function DotGrid() {
  const cols = 20, rows = 14, gap = 56;
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const delay = ((r * cols + c) * 0.07) % 4;
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={c * gap + gap / 2}
          cy={r * gap + gap / 2}
          r="1.5"
          fill="currentColor"
          style={{ animationDelay: `${delay.toFixed(2)}s` }}
        />
      );
    }
  }
  return (
    <svg
      viewBox={`0 0 ${cols * gap} ${rows * gap}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        color: "var(--em)", opacity: 0.18,
      }}
    >
      {dots}
    </svg>
  );
}

/* ------------------------------------------------------------------
   Page
------------------------------------------------------------------ */
export default function HomePage() {
  const popularTools = getPopularTools();
  const newTools = getNewTools();
  const t = useTranslations("Index");

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [ready, setReady] = useState(false);

  const rPop = useReveal();
  const rCats = useReveal();
  const rNew = useReveal();

  useEffect(() => setReady(true), []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

        /* --- tokens: light --- */
        :root {
          --bg:        #ffffff;
          --bg-2:      #edeae1;
          --surface:   #ffffff;
          --surface-2: #f0ede6;
          --surface-3: #e8e4da;
          --border:    rgba(0,0,0,0.09);
          --text:      #1a1a14;
          --text-2:    rgba(26,26,20,0.52);
          --text-3:    rgba(26,26,20,0.30);
          --em:        #059669;
          --em-rgb:    5,150,105;
          --em-s:      rgba(5,150,105,0.08);
          --em-h:      #10b981;
          --warm:      #d97706;
          --warm-rgb:  217,119,6;
          --rose:      #e11d48;
          --sh-sm:     0 1px 4px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
          --sh-md:     0 4px 20px rgba(0,0,0,0.08);
          --sh-lg:     0 16px 48px rgba(0,0,0,0.10);
          --r:         12px;
          --r-sm:      8px;
          --font-d:    'Syne', sans-serif;
          --font-b:    'Manrope', sans-serif;
          --ease:      0.22s cubic-bezier(0.4,0,0.2,1);
        }

        /* --- tokens: dark --- */
        .dark {
          --bg:        #06070e;
          --bg-2:      #0d0e1a;
          --surface:   #0d0e1a;
          --surface-2: #13152a;
          --surface-3: #1a1d33;
          --border:    rgba(255,255,255,0.07);
          --text:      #f0f0f5;
          --text-2:    rgba(220,222,248,0.55);
          --text-3:    rgba(220,222,248,0.28);
          --em:        #10b981;
          --em-rgb:    16,185,129;
          --em-s:      rgba(16,185,129,0.10);
          --em-h:      #34d399;
          --warm:      #f59e0b;
          --warm-rgb:  245,158,11;
          --rose:      #fb7185;
          --sh-sm:     0 1px 4px rgba(0,0,0,0.45);
          --sh-md:     0 4px 20px rgba(0,0,0,0.55);
          --sh-lg:     0 16px 48px rgba(0,0,0,0.75);
        }

        /* --- base --- */
        .lp { font-family: var(--font-b); color: var(--text); background: var(--bg); }
        .lp *, .lp *::before, .lp *::after { box-sizing: border-box; }
        .lp a { text-decoration: none; color: inherit; }

        /* --- theme button --- */
        .lp-theme-btn {
          position: fixed; top: 16px; right: 20px; z-index: 300;
          width: 36px; height: 36px; border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface);
          box-shadow: var(--sh-sm);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-2); cursor: pointer;
          transition: background var(--ease), color var(--ease),
                      border-color var(--ease), transform var(--ease);
        }
        .lp-theme-btn:hover {
          background: var(--surface-2); color: var(--text);
          border-color: rgba(var(--em-rgb),0.35);
          transform: scale(1.06);
        }

        /* --- hero --- */
        .lp-hero {
          position: relative; overflow: hidden;
          padding: 96px 24px 84px;
          text-align: center;
          background: #ffffff;
        }

        .dark .lp-hero {
          background: var(--bg);
        }

        /* dot grid layer */
        .lp-dots {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 0;
          overflow: hidden;
        }

        /* dot animation */
        @keyframes lp-dot {
          0%,100% { r: 1; opacity: 0.2; }
          50%      { r: 2.4; opacity: 0.7; }
        }
        .lp-dots circle {
          animation: lp-dot 4s ease-in-out infinite;
        }

        /* glow blobs */
        .lp-blob {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }
        .lp-blob-a {
          width: 540px; height: 540px;
          background: radial-gradient(circle, rgba(var(--em-rgb),0.12) 0%, transparent 68%);
          top: -130px; left: 50%;
          animation: lp-blob-a 9s ease-in-out infinite;
        }
        @keyframes lp-blob-a {
          0%,100% { transform: translateX(-52%) translateY(0); }
          50%      { transform: translateX(-52%) translateY(-24px); }
        }
        .lp-blob-b {
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(var(--warm-rgb),0.09) 0%, transparent 68%);
          top: 30px; right: -60px;
          animation: lp-blob-bc 10s ease-in-out infinite 2s reverse;
        }
        .lp-blob-c {
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(var(--em-rgb),0.07) 0%, transparent 68%);
          bottom: -30px; left: -40px;
          animation: lp-blob-bc 11s ease-in-out infinite 4s;
        }
        @keyframes lp-blob-bc {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-20px) scale(1.05); }
        }

        /* hero inner */
        .lp-hero-inner {
          position: relative; z-index: 1;
          max-width: 640px; margin: 0 auto;
          display: flex; flex-direction: column; align-items: center; gap: 24px;
        }

        /* entry animations */
        @keyframes lp-rise {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes lp-fade { from{opacity:0} to{opacity:1} }
        .e1{animation:lp-rise .55s cubic-bezier(.16,1,.3,1) .06s both}
        .e2{animation:lp-rise .55s cubic-bezier(.16,1,.3,1) .16s both}
        .e3{animation:lp-rise .55s cubic-bezier(.16,1,.3,1) .25s both}
        .e4{animation:lp-rise .55s cubic-bezier(.16,1,.3,1) .34s both}
        .e5{animation:lp-fade .55s ease .45s both}
        .e6{animation:lp-fade .55s ease .58s both}

        /* kicker pill */
        .lp-kicker {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 14px; border-radius: 9999px;
          border: 1px solid var(--border);
          background: var(--surface);
          box-shadow: var(--sh-sm);
          font-size: 12px; font-weight: 600; color: var(--text-2);
        }
        .lp-k-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--em); flex-shrink: 0;
          box-shadow: 0 0 6px rgba(var(--em-rgb),.8);
          animation: lp-blink 2.4s ease-in-out infinite;
        }
        @keyframes lp-blink {
          0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.8)}
        }

        /* h1 */
        .lp-h1 {
          font-family: var(--font-d);
          font-size: clamp(2.2rem,5.5vw,3.6rem);
          font-weight: 900; line-height: 1.05;
          letter-spacing: -0.035em; color: var(--text); margin: 0;
        }
        .lp-h1-em {
          position: relative; display: inline-block;
          color: var(--em);
        }
        .lp-h1-warm { color: var(--warm); }

        /* subtitle */
        .lp-sub {
          font-size: 15.5px; color: var(--text-2);
          line-height: 1.72; margin: 0; max-width: 500px;
        }

        /* search bar */
        .lp-search {
          position: relative; width: 100%; max-width: 460px;
          transition: transform var(--ease);
        }
        .lp-search.on { transform: translateY(-2px); }
        .lp-search-input {
          width: 100%; height: 48px; border-radius: 14px;
          border: 1.5px solid var(--border);
          background: var(--surface); color: var(--text);
          font-family: var(--font-b); font-size: 14px;
          padding: 0 68px 0 44px; outline: none;
          box-shadow: var(--sh-sm);
          transition: border-color var(--ease), box-shadow var(--ease);
        }
        .lp-search-input::placeholder { color: var(--text-3); }
        .lp-search-input:focus {
          border-color: rgba(var(--em-rgb),.5);
          box-shadow: 0 0 0 3px rgba(var(--em-rgb),.10), var(--sh-md);
        }
        .lp-search-ico {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%); pointer-events: none;
          color: var(--text-3); transition: color var(--ease);
        }
        .lp-search.on .lp-search-ico { color: var(--em); }
        .lp-search-kbd {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          font-size: 11px; color: var(--text-3);
          background: var(--surface-2); border: 1px solid var(--border);
          border-radius: 7px; padding: 2px 8px; pointer-events: none;
        }

        /* trust row */
        .lp-trust {
          display: flex; align-items: center; flex-wrap: wrap;
          gap: 5px 20px; justify-content: center;
        }
        .lp-trust-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 12.5px; font-weight: 500; color: var(--text-2);
        }
        .lp-trust-sep { color: var(--text-3); user-select: none; }

        /* stats strip */
        .lp-stats {
          display: flex; width: 100%; max-width: 380px;
          border: 1px solid var(--border); border-radius: var(--r);
          overflow: hidden; background: var(--surface); box-shadow: var(--sh-sm);
        }
        .lp-stat {
          flex: 1; padding: 14px 10px; text-align: center;
          border-right: 1px solid var(--border);
          transition: background var(--ease);
        }
        .lp-stat:last-child { border-right: none; }
        .lp-stat:hover { background: var(--surface-2); }
        .lp-stat-val {
          font-family: var(--font-d); font-size: 1.55rem;
          font-weight: 800; letter-spacing: -0.03em;
          color: var(--text); line-height: 1;
        }
        .lp-stat-lbl {
          font-size: 10.5px; color: var(--text-3);
          font-weight: 500; margin-top: 3px; white-space: nowrap;
        }

        /* divider */
        .lp-hr { height: 1px; background: var(--border); border: none; margin: 0; }

        /* section containers */
        .lp-sec { padding: 64px 24px; max-width: 1200px; margin: 0 auto; }
        .lp-sec-alt { padding: 64px 24px; background: var(--bg-2); }
        .lp-sec-alt-inner { max-width: 1200px; margin: 0 auto; }

        /* section header */
        .lp-sh {
          display: flex; flex-wrap: wrap; align-items: flex-end;
          justify-content: space-between; gap: 14px; margin-bottom: 32px;
        }
        .lp-sh-left { display: flex; flex-direction: column; gap: 3px; }
        .lp-tag {
          display: flex; align-items: center; gap: 6px;
          font-size: 10.5px; font-weight: 700; letter-spacing: 0.10em;
          text-transform: uppercase; color: var(--em);
        }
        .lp-tag-line {
          width: 16px; height: 2px; background: var(--em);
          border-radius: 2px; flex-shrink: 0;
        }
        .lp-h2 {
          font-family: var(--font-d);
          font-size: clamp(1.4rem,2.6vw,1.9rem);
          font-weight: 800; letter-spacing: -0.028em;
          color: var(--text); margin: 0; line-height: 1.15;
        }
        .lp-h2-sub {
          font-size: 13.5px; color: var(--text-2); margin: 0; line-height: 1.55;
        }

        /* view-all button */
        .lp-view-all {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 16px; border-radius: 9999px;
          border: 1px solid var(--border);
          font-size: 13px; font-weight: 600;
          color: var(--text-2); background: var(--surface);
          box-shadow: var(--sh-sm); white-space: nowrap;
          transition: color var(--ease), border-color var(--ease),
                      background var(--ease), transform var(--ease);
        }
        .lp-view-all:hover {
          color: var(--em);
          border-color: rgba(var(--em-rgb),.35);
          background: var(--em-s);
          transform: translateY(-1px);
        }
        .lp-view-all svg { transition: transform var(--ease); }
        .lp-view-all:hover svg { transform: translate(2px,-2px); }

        /* tool card grid */
        .lp-tool-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px,1fr));
          gap: 12px;
        }

        /* category card grid */
        .lp-cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px,1fr));
          gap: 10px;
        }

        /* category card */
        .lp-cat {
          position: relative; overflow: hidden;
          display: flex; flex-direction: column;
          padding: 18px; border-radius: var(--r);
          border: 1px solid var(--border);
          background: var(--surface); box-shadow: var(--sh-sm);
          transition: border-color var(--ease), box-shadow var(--ease), transform var(--ease);
        }
        .lp-cat::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(145deg, var(--em-s) 0%, transparent 55%);
          opacity: 0; transition: opacity var(--ease); pointer-events: none;
        }
        .lp-cat:hover {
          border-color: rgba(var(--em-rgb),.28);
          box-shadow: var(--sh-lg);
          transform: translateY(-3px);
        }
        .lp-cat:hover::before { opacity: 1; }

        .lp-cat-ico {
          width: 36px; height: 36px; border-radius: var(--r-sm);
          background: var(--em-s); color: var(--em);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px; flex-shrink: 0;
          transition: background var(--ease), color var(--ease), transform var(--ease);
        }
        .lp-cat:hover .lp-cat-ico {
          background: var(--em); color: #fff; transform: scale(1.08);
        }

        .lp-cat-name {
          font-family: var(--font-d); font-size: 14px; font-weight: 700;
          color: var(--text); margin-bottom: 5px;
          transition: color var(--ease);
        }
        .lp-cat:hover .lp-cat-name { color: var(--em); }

        .lp-cat-desc {
          font-size: 12px; color: var(--text-2); line-height: 1.55;
          flex: 1; overflow: hidden; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }

        .lp-cat-foot {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border);
        }
        .lp-cat-count {
          font-size: 11.5px; font-weight: 600; color: var(--text-3);
          transition: color var(--ease);
        }
        .lp-cat:hover .lp-cat-count { color: var(--em); }

        .lp-cat-arr {
          width: 22px; height: 22px; border-radius: 50%;
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-3);
          transition: background var(--ease), color var(--ease),
                      border-color var(--ease), transform var(--ease);
        }
        .lp-cat:hover .lp-cat-arr {
          background: var(--em-s); color: var(--em);
          border-color: rgba(var(--em-rgb),.3);
          transform: rotate(-45deg);
        }

        /* fresh badge */
        .lp-fresh {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 2px 8px; border-radius: 9999px;
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; vertical-align: middle; margin-left: 8px;
          background: linear-gradient(125deg, var(--warm), var(--rose));
          color: #fff;
        }

        /* scroll reveal */
        .lp-reveal {
          transition: opacity .65s ease, transform .65s cubic-bezier(.16,1,.3,1);
          will-change: opacity, transform;
        }
        .lp-reveal.h { opacity:0; transform:translateY(28px); }
        .lp-reveal.s { opacity:1; transform:translateY(0); }

        /* card stagger */
        .lp-sg > *:nth-child(1) { transition-delay:.00s }
        .lp-sg > *:nth-child(2) { transition-delay:.04s }
        .lp-sg > *:nth-child(3) { transition-delay:.07s }
        .lp-sg > *:nth-child(4) { transition-delay:.10s }
        .lp-sg > *:nth-child(5) { transition-delay:.13s }
        .lp-sg > *:nth-child(6) { transition-delay:.16s }
        .lp-sg > *:nth-child(7) { transition-delay:.19s }
        .lp-sg > *:nth-child(8) { transition-delay:.22s }

        /* responsive */
        @media(max-width:768px) {
          .lp-hero   { padding:70px 16px 60px }
          .lp-sec    { padding:48px 16px }
          .lp-sec-alt{ padding:48px 16px }
          .lp-tool-grid { grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:10px }
          .lp-cat-grid  { grid-template-columns:repeat(auto-fill,minmax(155px,1fr)); gap:9px }
          .lp-sh { flex-direction:column; align-items:flex-start }
        }
        @media(max-width:520px) {
          .lp-hero   { padding:56px 14px 48px }
          .lp-h1     { font-size:2.1rem }
          .lp-tool-grid { grid-template-columns:1fr 1fr; gap:9px }
          .lp-cat-grid  { grid-template-columns:1fr 1fr; gap:8px }
          .lp-trust-sep { display:none }
        }
        @media(max-width:360px) {
          .lp-tool-grid { grid-template-columns:1fr }
          .lp-cat-grid  { grid-template-columns:1fr }
        }
      ` }} />

      {/* Theme toggle removed to prevent duplication */}

      <div className="lp">

        {/* -------------------------------------------------------
            HERO
        ------------------------------------------------------- */}
        <section className="lp-hero">
          <div className="lp-hero-inner">

            {/* Pill */}
            {/* H1 */}
            <h1 className="lp-h1 e2">
              <span className="lp-h1-em">Every tool</span> you need,
              <br />
              <span className="lp-h1-warm">right now</span>
            </h1>

            {/* Subtitle */}
            <p className="lp-sub e3">{t("subtitle")}</p>

            {/* Search */}
            <div className={`lp-search e4${focused ? " on" : ""}`}>
              <Search className="lp-search-ico" size={16} />
              <input
                className="lp-search-input"
                type="text"
                value={query}
                placeholder='Search tools... "Password", "JSON", "PDF"'
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
              <span className="lp-search-kbd">Cmd K</span>
            </div>

            {/* Trust signals */}
            <div className="lp-trust e5">
              <div className="lp-trust-item">
                <Zap size={13} style={{ color: "var(--warm)", flexShrink: 0 }} />
                Instant results
              </div>
              <span className="lp-trust-sep">*</span>
              <div className="lp-trust-item">
                <Shield size={13} style={{ color: "var(--em)", flexShrink: 0 }} />
                100% private
              </div>
              <span className="lp-trust-sep">*</span>
              <div className="lp-trust-item">
                <Sparkles size={13} style={{ color: "var(--em)", flexShrink: 0 }} />
                Always free
              </div>
            </div>

            {/* Stats */}
            <div className="lp-stats e6">
              {[
                { to: 60, suffix: "+", label: "Tools" },
                { to: 100, suffix: "%", label: "Client-side" },
                { to: 0, suffix: "", label: "Sign-up" },
              ].map(s => (
                <div className="lp-stat" key={s.label}>
                  <div className="lp-stat-val">
                    {ready
                      ? <Counter to={s.to} suffix={s.suffix} />
                      : `${s.to}${s.suffix}`}
                  </div>
                  <div className="lp-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

          </div>
        </section>

        <hr className="lp-hr" />

        {/* -------------------------------------------------------
            POPULAR TOOLS
        ------------------------------------------------------- */}
        <div ref={rPop.ref} className={`lp-reveal ${rPop.visible ? "s" : "h"}`}>
          <section className="lp-sec">
            <div className="lp-sh">
              <div className="lp-sh-left">
                <div className="lp-tag">
                  <span className="lp-tag-line" />
                  <TrendingUp size={10} />
                  Most Used
                </div>
                <h2 className="lp-h2">Popular Tools</h2>
                <p className="lp-h2-sub">The tools our users reach for every single day.</p>
              </div>
              <Link href="/categories" className="lp-view-all">
                View all <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="lp-cat-grid lp-sg">
              {popularTools.slice(0, 8).map(tool => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.slug} href={tool.path} className="lp-cat">
                    <div className="lp-cat-ico"><Icon size={17} /></div>
                    <div className="lp-cat-name">{tool.name}</div>
                    <div className="lp-cat-desc">{tool.description}</div>
                    <div className="lp-cat-foot">
                      <span className="lp-cat-count">Popular</span>
                      <div className="lp-cat-arr"><ChevronRight size={11} /></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <hr className="lp-hr" />

        {/* -------------------------------------------------------
            CATEGORIES
        ------------------------------------------------------- */}
        <div ref={rCats.ref} className={`lp-reveal ${rCats.visible ? "s" : "h"}`}>
          <div className="lp-sec-alt">
            <div className="lp-sec-alt-inner">
              <div className="lp-sh">
                <div className="lp-sh-left">
                  <h2 className="lp-h2">Explore Categories</h2>
                  <p className="lp-h2-sub">Everything neatly organized into dedicated sections.</p>
                </div>
              </div>
              <div className="lp-cat-grid lp-sg">
                {toolCategories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <Link key={cat.slug} href={`/category/${cat.slug}`} className="lp-cat">
                      <div className="lp-cat-ico"><Icon size={17} /></div>
                      <div className="lp-cat-name">{cat.name}</div>
                      <div className="lp-cat-desc">{cat.description}</div>
                      <div className="lp-cat-foot">
                        <span className="lp-cat-count">{cat.tools.length} tools</span>
                        <div className="lp-cat-arr"><ChevronRight size={11} /></div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------
            RECENTLY ADDED
        ------------------------------------------------------- */}
        {newTools.length > 0 && (
          <>
            <hr className="lp-hr" />
            <div ref={rNew.ref} className={`lp-reveal ${rNew.visible ? "s" : "h"}`}>
              <section className="lp-sec">
                <div className="lp-sh">
                  <div className="lp-sh-left">
                    <div className="lp-tag">
                      <span className="lp-tag-line" />
                      <Clock size={10} />
                      Just Added
                    </div>
                    <h2 className="lp-h2">
                      Recently Added
                      <span className="lp-fresh"><Star size={8} /> Fresh</span>
                    </h2>
                    <p className="lp-h2-sub">Brand-new tools freshly added to the collection.</p>
                  </div>
                </div>
                <div className="lp-cat-grid lp-sg">
                  {newTools.slice(0, 4).map(tool => {
                    const Icon = tool.icon;
                    return (
                      <Link key={tool.slug} href={tool.path} className="lp-cat">
                        <div className="lp-cat-ico"><Icon size={17} /></div>
                        <div className="lp-cat-name">{tool.name}</div>
                        <div className="lp-cat-desc">{tool.description}</div>
                        <div className="lp-cat-foot">
                          <span className="lp-cat-count">New</span>
                          <div className="lp-cat-arr"><ChevronRight size={11} /></div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            </div>
          </>
        )}

      </div>
    </>
  );
}