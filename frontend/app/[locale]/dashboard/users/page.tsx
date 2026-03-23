"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Users, Search, Loader2, UserCircle2,
  ShieldCheck, Clock, Hash, Mail,
} from "lucide-react";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  role?: string;
  createdAt: string;
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/users", { credentials: "include" })
      .then(r => r.json())
      .then(d => setUsers(Array.isArray(d) ? d : []))
      .catch(() => {
        toast.info("Using mock data — backend not connected.");
        setUsers([
          { id: "u-1a2b3c", email: "admin@example.com", role: "ADMIN", createdAt: new Date().toISOString() },
          { id: "u-4d5e6f", email: "editor@example.com", role: "EDITOR", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
          { id: "u-7g8h9i", email: "viewer@example.com", role: "VIEWER", createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(query.toLowerCase()) ||
    u.id.toLowerCase().includes(query.toLowerCase())
  );

  const ROLE_CFG: Record<string, { color: string; bg: string; label: string }> = {
    ADMIN: { color: "#eab308", bg: "rgba(234,179,8,0.10)", label: "Admin" },
    EDITOR: { color: "#22c55e", bg: "rgba(34,197,94,0.09)", label: "Editor" },
    VIEWER: { color: "#9ca3af", bg: "rgba(156,163,175,0.09)", label: "Viewer" },
  };
  const getRole = (role?: string) => ROLE_CFG[role ?? ""] ?? ROLE_CFG["VIEWER"];

  const initials = (email: string) =>
    email.slice(0, 2).toUpperCase();

  /* avatar hue from email string */
  const avatarColor = (email: string) => {
    const hues = [22, 38, 280, 340, 160, 200];
    let hash = 0;
    for (const c of email) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
    return hues[hash % hues.length];
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600;700&display=swap');

        .um {
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
          --font-d:     'Syne', sans-serif;
          --font-b:     'Manrope', sans-serif;
          --ease:       0.20s cubic-bezier(0.4,0,0.2,1);
          font-family: var(--font-b); color: var(--text);
        }

        /* ── Header ──────────────────────────────────────────────── */
        .um-head {
          display: flex; flex-wrap: wrap; align-items: flex-end;
          justify-content: space-between; gap: 14px; margin-bottom: 26px;
        }
        .um-eyebrow {
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.10em;
          text-transform: uppercase; color: var(--accent); margin-bottom: 5px;
        }
        .um-eyebrow-line { width: 14px; height: 2px; background: var(--accent); border-radius: 2px; }
        .um-title {
          font-family: var(--font-d);
          font-size: clamp(1.35rem, 2.5vw, 1.8rem);
          font-weight: 800; letter-spacing: -0.028em;
          color: var(--text); margin: 0 0 4px;
        }
        .um-sub { font-size: 13px; color: var(--text-2); margin: 0; }

        /* ── Stat chips ──────────────────────────────────────────── */
        .um-chips { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .um-chip {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 9999px;
          border: 1px solid var(--border);
          background: var(--surface);
          font-size: 12px; font-weight: 600; color: var(--text-2);
        }
        .um-chip-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
        }

        /* ── Toolbar ─────────────────────────────────────────────── */
        .um-toolbar {
          display: flex; align-items: center; gap: 10px;
          flex-wrap: wrap; margin-bottom: 16px;
        }
        .um-search {
          position: relative; flex: 1;
          min-width: 200px; max-width: 340px;
        }
        .um-search-ico {
          position: absolute; left: 11px; top: 50%;
          transform: translateY(-50%); color: var(--text-3); pointer-events: none;
        }
        .um-search-input {
          width: 100%; height: 38px; padding: 0 12px 0 36px;
          border-radius: 9px; border: 1.5px solid var(--border);
          background: var(--surface); color: var(--text);
          font-family: var(--font-b); font-size: 13px; outline: none;
          transition: border-color var(--ease), box-shadow var(--ease);
        }
        .um-search-input::placeholder { color: var(--text-3); }
        .um-search-input:focus {
          border-color: rgba(var(--accent-rgb), 0.45);
          box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.08);
        }

        /* ── Count badge ─────────────────────────────────────────── */
        .um-count {
          margin-left: auto; font-size: 12px; font-weight: 600;
          color: var(--text-3);
        }

        /* ── Card ────────────────────────────────────────────────── */
        .um-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden;
        }

        /* ── Table ───────────────────────────────────────────────── */
        .um-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .um-table thead tr { border-bottom: 1px solid var(--border); }
        .um-table th {
          padding: 11px 16px; text-align: left;
          font-size: 10px; font-weight: 700; letter-spacing: 0.10em;
          text-transform: uppercase; color: var(--text-3); white-space: nowrap;
        }
        .um-table th:last-child { text-align: right; }
        .um-table tbody tr {
          border-bottom: 1px solid var(--border);
          transition: background var(--ease);
        }
        .um-table tbody tr:last-child { border-bottom: none; }
        .um-table tbody tr:hover { background: rgba(255,255,255,0.018); }
        .um-table td { padding: 13px 16px; vertical-align: middle; }
        .um-table td:last-child { text-align: right; }

        /* ── User cell ───────────────────────────────────────────── */
        .um-user-cell { display: flex; align-items: center; gap: 11px; }
        .um-avatar {
          width: 34px; height: 34px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-d); font-size: 12px; font-weight: 800;
          flex-shrink: 0; color: #fff; letter-spacing: 0.02em;
        }
        .um-user-email {
          font-size: 13.5px; font-weight: 600; color: var(--text);
        }
        .um-user-email-icon {
          display: none;
        }

        /* ── ID cell ─────────────────────────────────────────────── */
        .um-id {
          font-family: 'Geist Mono', 'Fira Code', monospace;
          font-size: 11.5px; color: var(--text-3); letter-spacing: 0.02em;
          background: var(--surface-2); border: 1px solid var(--border);
          padding: 3px 8px; border-radius: 6px; display: inline-block;
        }

        /* ── Role badge ──────────────────────────────────────────── */
        .um-role {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 9999px;
          font-size: 11px; font-weight: 700;
        }

        /* ── Date ────────────────────────────────────────────────── */
        .um-date {
          display: flex; align-items: center; justify-content: flex-end; gap: 5px;
          font-size: 12.5px; color: var(--text-2); white-space: nowrap;
        }

        /* ── Empty / Loading ─────────────────────────────────────── */
        .um-empty {
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; padding: 60px 24px; color: var(--text-3);
        }
        .um-empty-ico {
          width: 44px; height: 44px; border-radius: 12px;
          background: var(--surface-2);
          display: flex; align-items: center; justify-content: center;
        }
        .um-empty-lbl { font-size: 13.5px; font-weight: 600; color: var(--text-2); }
        .um-empty-sub { font-size: 12px; }

        /* ── Responsive ──────────────────────────────────────────── */
        .um-scroll { overflow-x: auto; }
        @media (max-width: 640px) {
          .um-head { flex-direction: column; align-items: flex-start; }
          .um-hide-sm { display: none; }
          .um-count  { margin-left: 0; }
        }
      ` }} />

      <div className="um">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="um-head">
          <div>
            <div className="um-eyebrow">
              <span className="um-eyebrow-line" />
              <Users size={10} />
              Accounts
            </div>
            <h1 className="um-title">User Management</h1>
            <p className="um-sub">View and manage registered administrator and consumer accounts.</p>
          </div>

          {/* Stat chips */}
          {!loading && (
            <div className="um-chips">
              <div className="um-chip">
                <span className="um-chip-dot" style={{ background: "var(--accent)" }} />
                {users.length} total
              </div>
              <div className="um-chip">
                <span className="um-chip-dot" style={{ background: "#22c55e" }} />
                {users.filter(u => u.role === "ADMIN").length || 1} admin
              </div>
            </div>
          )}
        </div>

        {/* ── Toolbar ────────────────────────────────────────────────── */}
        <div className="um-toolbar">
          <div className="um-search">
            <Search size={13} className="um-search-ico" />
            <input
              className="um-search-input"
              placeholder="Search by email or ID…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          {!loading && (
            <span className="um-count">
              {filtered.length} of {users.length} user{users.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* ── Table card ─────────────────────────────────────────────── */}
        <div className="um-card">
          <div className="um-scroll">
            <table className="um-table">
              <thead>
                <tr>
                  <th>Account</th>
                  <th className="um-hide-sm">User ID</th>
                  <th className="um-hide-sm">Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="um-empty">
                        <Loader2 size={22} style={{ animation: "um-spin 0.8s linear infinite", color: "var(--text-3)" }} />
                        <span className="um-empty-lbl">Loading users…</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="um-empty">
                        <div className="um-empty-ico"><UserCircle2 size={20} /></div>
                        <span className="um-empty-lbl">No users found</span>
                        <span className="um-empty-sub">
                          {query ? "Try a different search term." : "No registered accounts yet."}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map(u => {
                    const hue = avatarColor(u.email);
                    const role = getRole(u.role);
                    return (
                      <tr key={u.id}>
                        {/* Account */}
                        <td>
                          <div className="um-user-cell">
                            <div
                              className="um-avatar"
                              style={{
                                background: `hsl(${hue},65%,22%)`,
                                color: `hsl(${hue},80%,72%)`,
                              }}
                            >
                              {initials(u.email)}
                            </div>
                            <div>
                              <div className="um-user-email">{u.email}</div>
                              {/* show role inline on mobile */}
                              <div style={{ marginTop: 3 }} className="um-hide-lgsm">
                                <span
                                  className="um-role"
                                  style={{ background: role.bg, color: role.color, fontSize: 10 }}
                                >
                                  <ShieldCheck size={9} /> {role.label}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* ID */}
                        <td className="um-hide-sm">
                          <span className="um-id">{u.id}</span>
                        </td>

                        {/* Role */}
                        <td className="um-hide-sm">
                          <span
                            className="um-role"
                            style={{ background: role.bg, color: role.color }}
                          >
                            <ShieldCheck size={10} />
                            {role.label}
                          </span>
                        </td>

                        {/* Joined */}
                        <td>
                          <div className="um-date">
                            <Clock size={11} style={{ opacity: 0.4, flexShrink: 0 }} />
                            {format(new Date(u.createdAt), "MMM dd, yyyy")}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes um-spin { to { transform: rotate(360deg); } }` }} />
    </>
  );
}