"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Key, Copy, Plus, Loader2, Trash2,
  ShieldCheck, Eye, EyeOff, AlertTriangle,
  Check, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

type ApiKey = {
  id: string;
  key: string;
  label?: string;
  user?: { email: string };
  createdAt: string;
  lastUsed?: string | null;
};

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api-keys", { credentials: "include" })
      .then(r => r.json())
      .then(d => setKeys(Array.isArray(d) ? d : []))
      .catch(() => {
        toast.info("Using mock data — backend not connected.");
        setKeys([
          { id: "k-1", key: "sk_live_a1b2c3d4e5f6g7h8i9j0", label: "Production", user: { email: "admin@example.com" }, createdAt: new Date(Date.now() - 86400000 * 14).toISOString(), lastUsed: new Date(Date.now() - 3600000).toISOString() },
          { id: "k-2", key: "sk_test_z9y8x7w6v5u4t3s2r1q0", label: "Development", user: { email: "admin@example.com" }, createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), lastUsed: null },
          { id: "k-3", key: "sk_live_m1n2o3p4q5r6s7t8u9v0", label: "CI Pipeline", user: { email: "editor@example.com" }, createdAt: new Date().toISOString(), lastUsed: new Date().toISOString() },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    toast.success("API key copied to clipboard.");
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleVisible = (id: string) =>
    setVisible(v => ({ ...v, [id]: !v[id] }));

  const maskKey = (key: string) => {
    const prefix = key.slice(0, 10);
    const suffix = key.slice(-4);
    return `${prefix}${"•".repeat(12)}${suffix}`;
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Permanently revoke this API key? This cannot be undone.")) return;
    setKeys(k => k.filter(x => x.id !== id));
    toast.success("API key revoked.");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600;700&display=swap');

        .ak {
          --accent:     #eab308;
          --accent-rgb: 234,179,8;
          --accent-s:   rgba(234,179,8,0.09);
          --accent-h:   #fbbf24;
          --surface:    #111118;
          --surface-2:  #17171f;
          --surface-3:  #1d1e28;
          --border:     rgba(255,255,255,0.065);
          --text:       #ecedf5;
          --text-2:     rgba(210,212,238,0.46);
          --text-3:     rgba(190,192,225,0.24);
          --danger:     #ef4444;
          --danger-s:   rgba(239,68,68,0.08);
          --green:      #22c55e;
          --green-s:    rgba(34,197,94,0.09);
          --font-d:     'Syne', sans-serif;
          --font-b:     'Manrope', sans-serif;
          --ease:       0.20s cubic-bezier(0.4,0,0.2,1);
          font-family: var(--font-b); color: var(--text);
        }

        /* ── Header row ──────────────────────────────────────── */
        .ak-head {
          display: flex; flex-wrap: wrap; align-items: flex-end;
          justify-content: space-between; gap: 14px; margin-bottom: 24px;
        }
        .ak-eyebrow {
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.10em;
          text-transform: uppercase; color: var(--accent); margin-bottom: 5px;
        }
        .ak-eyebrow-line { width: 14px; height: 2px; background: var(--accent); border-radius: 2px; }
        .ak-title {
          font-family: var(--font-d);
          font-size: clamp(1.35rem,2.5vw,1.8rem);
          font-weight: 800; letter-spacing: -0.028em;
          color: var(--text); margin: 0 0 5px;
        }
        .ak-sub { font-size: 13px; color: var(--text-2); margin: 0; }

        /* ── Generate btn ────────────────────────────────────── */
        .ak-gen-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 10px;
          background: var(--accent); color: #0a0808;
          font-family: var(--font-b); font-size: 13px; font-weight: 700;
          border: none; cursor: pointer;
          transition: background var(--ease), transform var(--ease), box-shadow var(--ease), opacity var(--ease);
        }
        .ak-gen-btn:hover:not(:disabled) {
          background: var(--accent-h); transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(var(--accent-rgb),0.35);
        }
        .ak-gen-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* ── Warning banner ──────────────────────────────────── */
        .ak-warn {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 16px; border-radius: 10px;
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.18);
          margin-bottom: 18px;
        }
        .ak-warn-ico { color: var(--danger); flex-shrink: 0; margin-top: 1px; }
        .ak-warn-text { font-size: 12.5px; color: var(--text-2); line-height: 1.6; }
        .ak-warn-text strong { color: var(--danger); font-weight: 700; }

        /* ── Stats row ───────────────────────────────────────── */
        .ak-stats {
          display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px;
        }
        .ak-stat {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 14px; border-radius: 9px;
          background: var(--surface);
          border: 1px solid var(--border);
          font-size: 12.5px; font-weight: 600; color: var(--text-2);
        }
        .ak-stat-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
        }
        .ak-stat-val { color: var(--text); font-family: var(--font-d); font-size: 14px; font-weight: 700; }

        /* ── Key cards container ─────────────────────────────── */
        .ak-list { display: flex; flex-direction: column; gap: 10px; }

        /* ── Key card ────────────────────────────────────────── */
        .ak-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden;
          transition: border-color var(--ease), box-shadow var(--ease);
        }
        .ak-card:hover {
          border-color: rgba(var(--accent-rgb),0.2);
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }

        /* card inner */
        .ak-card-inner {
          display: grid;
          grid-template-columns: 44px 1fr auto;
          gap: 0 14px; padding: 16px 18px;
          align-items: center;
        }

        /* key icon */
        .ak-key-ico {
          width: 38px; height: 38px; border-radius: 10px;
          background: var(--accent-s);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent); flex-shrink: 0;
        }

        /* key main content */
        .ak-key-body { min-width: 0; }
        .ak-key-top {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          margin-bottom: 5px;
        }
        .ak-key-label {
          font-family: var(--font-d); font-size: 14px; font-weight: 700;
          color: var(--text); letter-spacing: -0.01em;
        }
        .ak-key-env {
          font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; padding: 2px 7px; border-radius: 5px;
        }
        .ak-key-string-row {
          display: flex; align-items: center; gap: 8px;
        }
        .ak-key-string {
          font-family: 'Geist Mono', 'Fira Code', monospace;
          font-size: 12.5px; color: var(--text-2);
          background: var(--surface-2);
          border: 1px solid var(--border);
          padding: 4px 10px; border-radius: 7px;
          letter-spacing: 0.03em; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
          max-width: 360px;
        }

        /* icon action button */
        .ak-ico-btn {
          width: 28px; height: 28px; border-radius: 7px;
          border: 1px solid var(--border); background: transparent;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-3); cursor: pointer; flex-shrink: 0;
          transition: background var(--ease), color var(--ease), border-color var(--ease);
        }
        .ak-ico-btn:hover { background: var(--surface-2); color: var(--text); border-color: rgba(255,255,255,0.12); }
        .ak-ico-btn.copied { background: var(--green-s); color: var(--green); border-color: rgba(34,197,94,0.3); }
        .ak-ico-btn.del:hover { background: var(--danger-s); color: var(--danger); border-color: rgba(239,68,68,0.2); }

        /* right actions */
        .ak-key-actions { display: flex; align-items: center; gap: 5px; }

        /* card footer */
        .ak-card-foot {
          padding: 9px 18px; border-top: 1px solid var(--border);
          background: var(--surface-2);
          display: flex; align-items: center; flex-wrap: wrap;
          gap: 6px 18px;
        }
        .ak-foot-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 11.5px; color: var(--text-3);
        }
        .ak-foot-item strong { color: var(--text-2); font-weight: 600; }
        .ak-foot-live {
          display: flex; align-items: center; gap: 5px;
          font-size: 11.5px; font-weight: 600;
        }
        .ak-foot-live-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
          animation: ak-pulse 2.2s ease-in-out infinite;
        }
        @keyframes ak-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.7)} }

        /* ── Empty / Loading ─────────────────────────────────── */
        .ak-empty {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 60px 24px;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .ak-empty-ico {
          width: 48px; height: 48px; border-radius: 13px;
          background: var(--surface-2);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-3);
        }
        .ak-empty-lbl { font-size: 14px; font-weight: 700; color: var(--text-2); }
        .ak-empty-sub { font-size: 12.5px; color: var(--text-3); }

        /* ── Responsive ──────────────────────────────────────── */
        @media (max-width: 680px) {
          .ak-card-inner { grid-template-columns: 38px 1fr; gap: 0 10px; }
          .ak-key-actions { display: none; }
          .ak-key-string { max-width: 200px; }
          .ak-head { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .ak-key-string { max-width: 140px; }
        }

        @keyframes ak-spin { to { transform: rotate(360deg); } }
      ` }} />

      <div className="ak">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="ak-head">
          <div>
            <div className="ak-eyebrow">
              <span className="ak-eyebrow-line" />
              <Key size={10} />
              Security
            </div>
            <h1 className="ak-title">API Keys</h1>
            <p className="ak-sub">Manage remote deployment and machine-to-machine integration keys.</p>
          </div>
          <button className="ak-gen-btn" disabled>
            <Plus size={14} /> Generate Key
          </button>
        </div>

        {/* ── Security warning ────────────────────────────────────────── */}
        <div className="ak-warn">
          <AlertTriangle size={14} className="ak-warn-ico" />
          <p className="ak-warn-text">
            <strong>Keep keys secret.</strong> Never expose API keys in client-side code,
            public repos, or browser URLs. Treat them like passwords.
          </p>
        </div>

        {/* ── Stats ───────────────────────────────────────────────────── */}
        {!loading && keys.length > 0 && (
          <div className="ak-stats">
            <div className="ak-stat">
              <span className="ak-stat-dot" style={{ background: "var(--accent)" }} />
              <span className="ak-stat-val">{keys.length}</span>
              active key{keys.length !== 1 ? "s" : ""}
            </div>
            <div className="ak-stat">
              <span className="ak-stat-dot" style={{ background: "var(--green)" }} />
              <span className="ak-stat-val">
                {keys.filter(k => k.lastUsed).length}
              </span>
              used recently
            </div>
          </div>
        )}

        {/* ── Key list ────────────────────────────────────────────────── */}
        {loading ? (
          <div className="ak-empty">
            <div className="ak-empty-ico">
              <Loader2 size={22} style={{ animation: "ak-spin 0.8s linear infinite" }} />
            </div>
            <span className="ak-empty-lbl">Loading API keys…</span>
          </div>
        ) : keys.length === 0 ? (
          <div className="ak-empty">
            <div className="ak-empty-ico"><Key size={20} /></div>
            <span className="ak-empty-lbl">No API keys yet</span>
            <span className="ak-empty-sub">Generate your first key to start integrating.</span>
          </div>
        ) : (
          <div className="ak-list">
            {keys.map(k => {
              const isVisible = !!visible[k.id];
              const isCopied = copied === k.id;
              const isLive = k.key.startsWith("sk_live");

              return (
                <div key={k.id} className="ak-card">
                  <div className="ak-card-inner">

                    {/* Icon */}
                    <div className="ak-key-ico"><Key size={17} /></div>

                    {/* Body */}
                    <div className="ak-key-body">
                      <div className="ak-key-top">
                        <span className="ak-key-label">{k.label || "API Key"}</span>
                        <span
                          className="ak-key-env"
                          style={isLive
                            ? { background: "rgba(34,197,94,0.10)", color: "#22c55e" }
                            : { background: "var(--surface-3)", color: "var(--text-3)" }
                          }
                        >
                          {isLive ? "live" : "test"}
                        </span>
                        {k.user?.email && (
                          <span style={{ fontSize: 11.5, color: "var(--text-3)" }}>
                            {k.user.email}
                          </span>
                        )}
                      </div>

                      <div className="ak-key-string-row">
                        <code className="ak-key-string">
                          {isVisible ? k.key : maskKey(k.key)}
                        </code>
                        <button
                          className="ak-ico-btn"
                          title={isVisible ? "Hide key" : "Reveal key"}
                          onClick={() => toggleVisible(k.id)}
                        >
                          {isVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button
                          className={`ak-ico-btn${isCopied ? " copied" : ""}`}
                          title="Copy key"
                          onClick={() => copyKey(k.id, k.key)}
                        >
                          {isCopied ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ak-key-actions">
                      <button
                        className="ak-ico-btn del"
                        title="Revoke key"
                        onClick={() => handleDelete(k.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="ak-card-foot">
                    <div className="ak-foot-item">
                      <ShieldCheck size={11} />
                      Created <strong>{format(new Date(k.createdAt), "MMM dd, yyyy")}</strong>
                    </div>
                    {k.lastUsed ? (
                      <div className="ak-foot-live" style={{ color: "var(--green)" }}>
                        <span className="ak-foot-live-dot" style={{ background: "var(--green)" }} />
                        Last used {format(new Date(k.lastUsed), "MMM dd, HH:mm")}
                      </div>
                    ) : (
                      <div className="ak-foot-item">
                        <RefreshCw size={11} />
                        Never used
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </>
  );
}