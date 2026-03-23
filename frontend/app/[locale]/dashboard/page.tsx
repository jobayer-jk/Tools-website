import {
  FileText, Users, Activity, Key,
  TrendingUp, ArrowUpRight, Clock, Zap,
} from "lucide-react";
import Link from "next/link";

/* ── Quick-stat data ─────────────────────────────────────────────────── */
const STATS = [
  { label: "Total Articles", value: "—", icon: FileText, href: "/dashboard/articles", change: null },
  { label: "Total Users", value: "—", icon: Users, href: "/dashboard/users", change: null },
  { label: "API Keys", value: "—", icon: Key, href: "/dashboard/api-keys", change: null },
  { label: "Activity Logs", value: "—", icon: Activity, href: "/dashboard/history", change: null },
];

const QUICK = [
  { label: "New Article", href: "/dashboard/articles", icon: FileText },
  { label: "Manage Users", href: "/dashboard/users", icon: Users },
  { label: "View Logs", href: "/dashboard/history", icon: Activity },
  { label: "Global Settings", href: "/dashboard/settings", icon: Zap },
];

export default function DashboardOverviewPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .ov {
          --accent:     #eab308;
          --accent-rgb: 234,179,8;
          --accent-s:   rgba(234,179,8,0.09);
          --surface:    #111118;
          --surface-2:  #17171f;
          --border:     rgba(255,255,255,0.065);
          --text:       #ecedf5;
          --text-2:     rgba(210,212,238,0.46);
          --text-3:     rgba(190,192,225,0.24);
          --green:      #22c55e;
          --green-s:    rgba(34,197,94,0.09);
          --font-d:     'Syne', sans-serif;
          --font-b:     'Manrope', sans-serif;
          --ease:       0.20s cubic-bezier(0.4,0,0.2,1);
          font-family: var(--font-b);
          color: var(--text);
        }

        /* ── Page heading ──────────────────────────────────────── */
        .ov-head { margin-bottom: 28px; }
        .ov-eyebrow {
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.10em;
          text-transform: uppercase; color: var(--accent);
          margin-bottom: 6px;
        }
        .ov-eyebrow-line {
          width: 14px; height: 2px; background: var(--accent);
          border-radius: 2px; flex-shrink: 0;
        }
        .ov-title {
          font-family: var(--font-d);
          font-size: clamp(1.4rem,2.5vw,1.9rem);
          font-weight: 800; letter-spacing: -0.028em;
          color: var(--text); margin: 0 0 6px;
        }
        .ov-sub {
          font-size: 13.5px; color: var(--text-2); margin: 0;
        }

        /* ── Stats grid ────────────────────────────────────────── */
        .ov-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px,1fr));
          gap: 12px; margin-bottom: 28px;
        }
        .ov-stat {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px; padding: 18px 20px;
          display: flex; flex-direction: column; gap: 14px;
          text-decoration: none;
          transition: border-color var(--ease), transform var(--ease), box-shadow var(--ease);
          position: relative; overflow: hidden;
        }
        .ov-stat::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(140deg, rgba(var(--accent-rgb),0.04) 0%, transparent 55%);
          opacity: 0; transition: opacity var(--ease);
        }
        .ov-stat:hover {
          border-color: rgba(var(--accent-rgb), 0.25);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .ov-stat:hover::before { opacity: 1; }

        .ov-stat-top {
          display: flex; align-items: center; justify-content: space-between;
        }
        .ov-stat-ico {
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          background: var(--accent-s); color: var(--accent); flex-shrink: 0;
        }
        .ov-stat-arr {
          color: var(--text-3);
          transition: color var(--ease), transform var(--ease);
        }
        .ov-stat:hover .ov-stat-arr { color: var(--accent); transform: translate(2px,-2px); }

        .ov-stat-val {
          font-family: var(--font-d);
          font-size: 1.9rem; font-weight: 800;
          letter-spacing: -0.04em; color: var(--text);
          line-height: 1;
        }
        .ov-stat-lbl {
          font-size: 12px; font-weight: 600; color: var(--text-2); margin-top: 4px;
        }

        /* ── Two-col layout ────────────────────────────────────── */
        .ov-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
        }
        @media (max-width: 900px) { .ov-row { grid-template-columns: 1fr; } }

        /* ── Panel ─────────────────────────────────────────────── */
        .ov-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden;
        }
        .ov-panel-head {
          padding: 16px 20px; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .ov-panel-title {
          font-family: var(--font-d);
          font-size: 13px; font-weight: 700;
          color: var(--text); letter-spacing: -0.01em;
        }
        .ov-panel-meta {
          font-size: 11px; font-weight: 600;
          color: var(--text-3); letter-spacing: 0.02em;
        }

        /* ── Quick actions ─────────────────────────────────────── */
        .ov-quick-list {
          padding: 8px;
          display: flex; flex-direction: column; gap: 2px;
        }
        .ov-quick-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 12px; border-radius: 9px;
          text-decoration: none;
          transition: background var(--ease);
        }
        .ov-quick-item:hover { background: var(--surface-2); }
        .ov-quick-left { display: flex; align-items: center; gap: 10px; }
        .ov-quick-ico {
          width: 28px; height: 28px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04); color: var(--text-3);
          flex-shrink: 0;
          transition: background var(--ease), color var(--ease);
        }
        .ov-quick-item:hover .ov-quick-ico {
          background: var(--accent-s); color: var(--accent);
        }
        .ov-quick-name {
          font-size: 13px; font-weight: 600; color: var(--text-2);
          transition: color var(--ease);
        }
        .ov-quick-item:hover .ov-quick-name { color: var(--text); }
        .ov-quick-arr {
          color: var(--text-3);
          transition: color var(--ease), transform var(--ease);
        }
        .ov-quick-item:hover .ov-quick-arr { color: var(--accent); transform: translate(2px,-2px); }

        /* ── Status panel ──────────────────────────────────────── */
        .ov-status-list { padding: 12px 20px; display: flex; flex-direction: column; gap: 12px; }
        .ov-status-row {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
        }
        .ov-status-label { font-size: 12.5px; font-weight: 600; color: var(--text-2); }
        .ov-status-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 9999px;
          font-size: 11px; font-weight: 700;
        }
        .ov-status-pill.ok {
          background: var(--green-s); color: var(--green);
        }
        .ov-status-pill.ok::before {
          content: ''; width: 5px; height: 5px; border-radius: 50%;
          background: var(--green); flex-shrink: 0;
          animation: ov-pulse 2.2s ease-in-out infinite;
        }
        @keyframes ov-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.6); }
        }
        .ov-status-pill.warn {
          background: rgba(234,179,8,0.09); color: var(--accent);
        }
        .ov-status-line { height: 1px; background: var(--border); }
        .ov-status-ts {
          display: flex; align-items: center; gap: 5px;
          font-size: 11.5px; color: var(--text-3); padding-bottom: 4px;
        }
      ` }} />

      <div className="ov">
        {/* ── Heading ──────────────────────────────────────────────── */}
        <div className="ov-head">
          <div className="ov-eyebrow">
            <span className="ov-eyebrow-line" />
            <TrendingUp size={10} />
            Overview
          </div>
          <h1 className="ov-title">Dashboard</h1>
          <p className="ov-sub">Welcome back. Here's what's happening across your CMS.</p>
        </div>

        {/* ── Stats ────────────────────────────────────────────────── */}
        <div className="ov-stats">
          {STATS.map((s) => (
            <Link key={s.href} href={s.href} className="ov-stat">
              <div className="ov-stat-top">
                <div className="ov-stat-ico"><s.icon size={16} /></div>
                <ArrowUpRight size={14} className="ov-stat-arr" />
              </div>
              <div>
                <div className="ov-stat-val">{s.value}</div>
                <div className="ov-stat-lbl">{s.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Bottom row ───────────────────────────────────────────── */}
        <div className="ov-row">

          {/* Quick actions */}
          <div className="ov-panel">
            <div className="ov-panel-head">
              <span className="ov-panel-title">Quick Actions</span>
              <span className="ov-panel-meta">Shortcuts</span>
            </div>
            <div className="ov-quick-list">
              {QUICK.map((q) => (
                <Link key={q.href} href={q.href} className="ov-quick-item">
                  <div className="ov-quick-left">
                    <div className="ov-quick-ico"><q.icon size={13} /></div>
                    <span className="ov-quick-name">{q.label}</span>
                  </div>
                  <ArrowUpRight size={13} className="ov-quick-arr" />
                </Link>
              ))}
            </div>
          </div>

          {/* System status */}
          <div className="ov-panel">
            <div className="ov-panel-head">
              <span className="ov-panel-title">System Status</span>
              <span className="ov-panel-meta">Live</span>
            </div>
            <div className="ov-status-list">
              {[
                { label: "CMS Backend", status: "ok", text: "Operational" },
                { label: "Database", status: "ok", text: "Operational" },
                { label: "Image Storage", status: "ok", text: "Operational" },
                { label: "Authentication", status: "ok", text: "Operational" },
                { label: "Cache Layer", status: "warn", text: "Degraded" },
              ].map((r, i, arr) => (
                <div key={r.label}>
                  <div className="ov-status-row">
                    <span className="ov-status-label">{r.label}</span>
                    <span className={`ov-status-pill ${r.status}`}>{r.text}</span>
                  </div>
                  {i < arr.length - 1 && <div className="ov-status-line" style={{ marginTop: 12 }} />}
                </div>
              ))}
              <div className="ov-status-ts">
                <Clock size={11} />
                Last checked just now
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}