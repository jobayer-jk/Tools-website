"use client";

import { useState } from "react";
import {
  Activity, ShieldAlert, Search, Filter,
  LogIn, Settings, Database, UserPlus,
  Trash2, FileEdit, RefreshCw, Lock,
  Clock, ChevronDown,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

type Log = {
  id: number;
  action: string;
  user: string;
  timestamp: string;
  meta?: string;
};

const MOCK_LOGS: Log[] = [
  { id: 1, action: "SYSTEM_SEEDED", user: "system", timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), meta: "Initial seed run" },
  { id: 2, action: "LOGIN_SUCCESS", user: "admin@example.com", timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, action: "ARTICLE_CREATED", user: "admin@example.com", timestamp: new Date(Date.now() - 72000000).toISOString(), meta: "welcome-post" },
  { id: 4, action: "SETTINGS_UPDATED", user: "admin@example.com", timestamp: new Date(Date.now() - 36000000).toISOString(), meta: "siteName changed" },
  { id: 5, action: "USER_INVITED", user: "admin@example.com", timestamp: new Date(Date.now() - 18000000).toISOString(), meta: "editor@example.com" },
  { id: 6, action: "ARTICLE_DELETED", user: "admin@example.com", timestamp: new Date(Date.now() - 7200000).toISOString(), meta: "old-draft" },
  { id: 7, action: "LOGIN_SUCCESS", user: "editor@example.com", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 8, action: "ARTICLE_UPDATED", user: "editor@example.com", timestamp: new Date(Date.now() - 1800000).toISOString(), meta: "welcome-post" },
  { id: 9, action: "LOGIN_SUCCESS", user: "admin@example.com", timestamp: new Date(Date.now() - 600000).toISOString() },
  { id: 10, action: "SETTINGS_UPDATED", user: "admin@example.com", timestamp: new Date().toISOString(), meta: "logo uploaded" },
];

/* ── Action config ──────────────────────────────────────────────────────── */
type ActionConfig = { icon: React.FC<any>; color: string; bg: string; label: string };

const ACTION_MAP: Record<string, ActionConfig> = {
  LOGIN_SUCCESS: { icon: LogIn, color: "#22c55e", bg: "rgba(34,197,94,0.10)", label: "Login" },
  SYSTEM_SEEDED: { icon: Database, color: "#a78bfa", bg: "rgba(167,139,250,0.10)", label: "Seed" },
  SETTINGS_UPDATED: { icon: Settings, color: "#eab308", bg: "rgba(234,179,8,0.10)", label: "Settings" },
  ARTICLE_CREATED: { icon: FileEdit, color: "#34d399", bg: "rgba(52,211,153,0.10)", label: "Article" },
  ARTICLE_UPDATED: { icon: RefreshCw, color: "#fb923c", bg: "rgba(251,146,60,0.10)", label: "Article" },
  ARTICLE_DELETED: { icon: Trash2, color: "#ef4444", bg: "rgba(239,68,68,0.09)", label: "Article" },
  USER_INVITED: { icon: UserPlus, color: "#f472b6", bg: "rgba(244,114,182,0.10)", label: "User" },
  LOGIN_FAILED: { icon: Lock, color: "#ef4444", bg: "rgba(239,68,68,0.09)", label: "Auth" },
};
const FALLBACK: ActionConfig = { icon: Activity, color: "#9ca3af", bg: "rgba(156,163,175,0.09)", label: "Event" };

const getActionCfg = (action: string): ActionConfig =>
  ACTION_MAP[action] ?? FALLBACK;

const ALL_FILTERS = ["ALL", "LOGIN_SUCCESS", "SETTINGS_UPDATED", "ARTICLE_CREATED", "ARTICLE_UPDATED", "ARTICLE_DELETED", "USER_INVITED"];

export default function HistoryLogsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [show, setShow] = useState(false); // filter dropdown on mobile

  const filtered = MOCK_LOGS.filter(l => {
    const matchQ = l.action.toLowerCase().includes(query.toLowerCase()) ||
      l.user.toLowerCase().includes(query.toLowerCase()) ||
      (l.meta ?? "").toLowerCase().includes(query.toLowerCase());
    const matchF = filter === "ALL" || l.action === filter;
    return matchQ && matchF;
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600;700&display=swap');

        .hl {
          --accent:     #eab308;
          --accent-rgb: 234,179,8;
          --accent-s:   rgba(234,179,8,0.09);
          --surface:    #111118;
          --surface-2:  #17171f;
          --surface-3:  #1d1e28;
          --border:     rgba(255,255,255,0.065);
          --text:       #ecedf5;
          --text-2:     rgba(210,212,238,0.46);
          --text-3:     rgba(190,192,225,0.24);
          --danger:     #ef4444;
          --danger-s:   rgba(239,68,68,0.08);
          --font-d:     'Syne', sans-serif;
          --font-b:     'Manrope', sans-serif;
          --ease:       0.20s cubic-bezier(0.4,0,0.2,1);
          font-family: var(--font-b); color: var(--text);
        }

        /* ── Header ──────────────────────────────────────────── */
        .hl-head { margin-bottom: 22px; }
        .hl-eyebrow {
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.10em;
          text-transform: uppercase; color: var(--accent); margin-bottom: 5px;
        }
        .hl-eyebrow-line { width: 14px; height: 2px; background: var(--accent); border-radius: 2px; }
        .hl-title {
          font-family: var(--font-d);
          font-size: clamp(1.35rem,2.5vw,1.8rem);
          font-weight: 800; letter-spacing: -0.028em;
          color: var(--text); margin: 0 0 5px;
        }
        .hl-sub { font-size: 13px; color: var(--text-2); margin: 0; }

        /* ── Notice banner ───────────────────────────────────── */
        .hl-notice {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 16px; border-radius: 10px;
          background: rgba(234,179,8,0.06);
          border: 1px solid rgba(234,179,8,0.18);
          margin-bottom: 20px;
        }
        .hl-notice-ico { color: var(--accent); flex-shrink: 0; margin-top: 1px; }
        .hl-notice-text { font-size: 12.5px; color: var(--text-2); line-height: 1.6; }
        .hl-notice-text strong { color: var(--accent); font-weight: 700; }

        /* ── Toolbar ─────────────────────────────────────────── */
        .hl-toolbar {
          display: flex; align-items: center; flex-wrap: wrap;
          gap: 10px; margin-bottom: 16px;
        }
        .hl-search {
          position: relative; flex: 1;
          min-width: 200px; max-width: 320px;
        }
        .hl-search-ico {
          position: absolute; left: 11px; top: 50%;
          transform: translateY(-50%);
          color: var(--text-3); pointer-events: none;
        }
        .hl-search-input {
          width: 100%; height: 38px; padding: 0 12px 0 36px;
          border-radius: 9px; border: 1.5px solid var(--border);
          background: var(--surface); color: var(--text);
          font-family: var(--font-b); font-size: 13px; outline: none;
          transition: border-color var(--ease), box-shadow var(--ease);
        }
        .hl-search-input::placeholder { color: var(--text-3); }
        .hl-search-input:focus {
          border-color: rgba(var(--accent-rgb),0.45);
          box-shadow: 0 0 0 3px rgba(var(--accent-rgb),0.08);
        }

        /* ── Filter pills ────────────────────────────────────── */
        .hl-pills { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
        .hl-pill {
          padding: 5px 12px; border-radius: 9999px;
          border: 1px solid var(--border); background: transparent;
          color: var(--text-2); font-family: var(--font-b);
          font-size: 11.5px; font-weight: 600; cursor: pointer;
          transition: background var(--ease), color var(--ease), border-color var(--ease);
          white-space: nowrap;
        }
        .hl-pill:hover { background: var(--surface-2); color: var(--text); }
        .hl-pill.on {
          background: var(--accent-s); color: var(--accent);
          border-color: rgba(var(--accent-rgb),0.3);
        }

        /* ── Count ───────────────────────────────────────────── */
        .hl-count {
          margin-left: auto; font-size: 12px; font-weight: 600;
          color: var(--text-3);
        }

        /* ── Log list ────────────────────────────────────────── */
        .hl-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden;
        }

        /* ── Timeline list ───────────────────────────────────── */
        .hl-list { padding: 6px 0; }

        .hl-item {
          display: grid;
          grid-template-columns: 42px 1fr auto;
          gap: 0 12px;
          align-items: start;
          padding: 13px 18px;
          border-bottom: 1px solid var(--border);
          transition: background var(--ease);
          position: relative;
        }
        .hl-item:last-child { border-bottom: none; }
        .hl-item:hover { background: rgba(255,255,255,0.018); }

        /* left icon column */
        .hl-item-ico-wrap {
          display: flex; flex-direction: column; align-items: center;
          padding-top: 2px; gap: 0;
        }
        .hl-item-ico {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .hl-item-line {
          width: 1.5px; flex: 1; min-height: 12px;
          background: var(--border); margin-top: 5px;
        }
        .hl-item:last-child .hl-item-line { display: none; }

        /* middle content column */
        .hl-item-body { min-width: 0; }
        .hl-item-action-row {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .hl-item-action {
          font-size: 13px; font-weight: 700; color: var(--text);
          font-family: 'Geist Mono', monospace; letter-spacing: 0.01em;
        }
        .hl-item-tag {
          font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
          padding: 2px 7px; border-radius: 4px;
          text-transform: uppercase;
        }
        .hl-item-user {
          font-size: 12px; color: var(--text-2); margin-top: 3px;
          display: flex; align-items: center; gap: 5px;
        }
        .hl-item-meta {
          font-size: 11.5px; color: var(--text-3); margin-top: 2px;
          font-style: italic;
        }

        /* right timestamp column */
        .hl-item-time {
          display: flex; flex-direction: column; align-items: flex-end;
          gap: 3px; flex-shrink: 0; padding-top: 2px;
        }
        .hl-item-rel {
          font-size: 11.5px; font-weight: 600; color: var(--text-3);
          white-space: nowrap;
        }
        .hl-item-abs {
          font-size: 10.5px; color: var(--text-3);
          white-space: nowrap;
          font-family: 'Geist Mono', monospace;
        }

        /* ── Empty ───────────────────────────────────────────── */
        .hl-empty {
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; padding: 60px 24px; color: var(--text-3);
        }
        .hl-empty-ico {
          width: 44px; height: 44px; border-radius: 12px;
          background: var(--surface-2);
          display: flex; align-items: center; justify-content: center;
        }
        .hl-empty-lbl { font-size: 13.5px; font-weight: 600; color: var(--text-2); }
        .hl-empty-sub { font-size: 12px; }

        /* ── Responsive ──────────────────────────────────────── */
        @media (max-width: 600px) {
          .hl-item { grid-template-columns: 36px 1fr; }
          .hl-item-time { display: none; }
          .hl-item-user { flex-wrap: wrap; }
          .hl-count { margin-left: 0; }
          .hl-pills { display: none; }
        }
      ` }} />

      <div className="hl">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="hl-head">
          <div className="hl-eyebrow">
            <span className="hl-eyebrow-line" />
            <Activity size={10} />
            Telemetry
          </div>
          <h1 className="hl-title">Activity Logs</h1>
          <p className="hl-sub">Real-time system actions and administrative execution history.</p>
        </div>

        {/* ── Notice ─────────────────────────────────────────────────── */}
        <div className="hl-notice">
          <ShieldAlert size={15} className="hl-notice-ico" />
          <p className="hl-notice-text">
            <strong>Notice:</strong> The live telemetry backend module is currently unlinked.
            Displaying locally cached mock data for UI development.
          </p>
        </div>

        {/* ── Toolbar ────────────────────────────────────────────────── */}
        <div className="hl-toolbar">
          <div className="hl-search">
            <Search size={13} className="hl-search-ico" />
            <input
              className="hl-search-input"
              placeholder="Search actions, users…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          <div className="hl-pills">
            <button
              className={`hl-pill${filter === "ALL" ? " on" : ""}`}
              onClick={() => setFilter("ALL")}
            >All</button>
            {["LOGIN_SUCCESS", "SETTINGS_UPDATED", "ARTICLE_CREATED", "ARTICLE_UPDATED", "ARTICLE_DELETED", "USER_INVITED"].map(f => {
              const cfg = getActionCfg(f);
              return (
                <button
                  key={f}
                  className={`hl-pill${filter === f ? " on" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>

          <span className="hl-count">
            {filtered.length} event{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Log card ───────────────────────────────────────────────── */}
        <div className="hl-card">
          {filtered.length === 0 ? (
            <div className="hl-empty">
              <div className="hl-empty-ico"><Activity size={18} /></div>
              <span className="hl-empty-lbl">No events found</span>
              <span className="hl-empty-sub">Try adjusting your search or filter.</span>
            </div>
          ) : (
            <div className="hl-list">
              {filtered.map(log => {
                const cfg = getActionCfg(log.action);
                const Icon = cfg.icon;
                return (
                  <div key={log.id} className="hl-item">

                    {/* Icon + connecting line */}
                    <div className="hl-item-ico-wrap">
                      <div
                        className="hl-item-ico"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        <Icon size={15} />
                      </div>
                      <div className="hl-item-line" />
                    </div>

                    {/* Content */}
                    <div className="hl-item-body">
                      <div className="hl-item-action-row">
                        <span className="hl-item-action">{log.action}</span>
                        <span
                          className="hl-item-tag"
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <div className="hl-item-user">
                        <span style={{
                          width: 18, height: 18, borderRadius: 5,
                          background: "var(--surface-3)",
                          display: "inline-flex", alignItems: "center",
                          justifyContent: "center", fontSize: 9,
                          fontWeight: 700, color: "var(--text-2)",
                          flexShrink: 0,
                        }}>
                          {log.user.slice(0, 2).toUpperCase()}
                        </span>
                        {log.user}
                      </div>
                      {log.meta && (
                        <div className="hl-item-meta">→ {log.meta}</div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="hl-item-time">
                      <span className="hl-item-rel">
                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                      </span>
                      <span className="hl-item-abs">
                        {format(new Date(log.timestamp), "MMM dd, HH:mm")}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </>
  );
}