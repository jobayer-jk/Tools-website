"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Settings, LogOut,
  Users, Activity, Key, ChevronRight, Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview", section: "Workspace" },
  { href: "/dashboard/articles", icon: FileText, label: "Articles", section: null },
  { href: "/dashboard/users", icon: Users, label: "Users", section: null },
  { href: "/dashboard/history", icon: Activity, label: "Activity Logs", section: "System" },
  { href: "/dashboard/api-keys", icon: Key, label: "API Keys", section: null },
  { href: "/dashboard/settings", icon: Settings, label: "Settings", section: null },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const stripped = pathname.replace(/^\/(en|es)/, "");
  const isActive = (href: string) =>
    href === "/dashboard" ? stripped === "/dashboard" : stripped.startsWith(href);

  const activeItem = NAV.find((n) => isActive(n.href));

  const handleLogout = () => {
    toast.success("Signing out…");
    router.push("/login");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600;700&display=swap');

        .db {
          --bg:         #09090f;
          --sb:         #0c0c13;
          --surface:    #111118;
          --surface-2:  #17171f;
          --border:     rgba(255,255,255,0.065);
          --text:       #ecedf5;
          --text-2:     rgba(210,212,238,0.46);
          --text-3:     rgba(190,192,225,0.24);
          --accent:     #eab308;
          --accent-rgb: 234,179,8;
          --accent-s:   rgba(234,179,8,0.09);
          --accent-h:   #fbbf24;
          --danger:     #ef4444;
          --danger-s:   rgba(239,68,68,0.08);
          --font-d:     'Syne', sans-serif;
          --font-b:     'Manrope', sans-serif;
          --ease:       0.20s cubic-bezier(0.4,0,0.2,1);
          --sw:         224px;

          display: flex; min-height: 100vh;
          background: var(--bg); color: var(--text);
          font-family: var(--font-b);
        }

        /* ══ Sidebar ═══════════════════════════════════════════════ */
        .db-sb {
          width: var(--sw); flex-shrink: 0;
          background: var(--sb);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          position: sticky; top: 0; height: 100vh;
          overflow-y: auto; z-index: 50;
        }
        @media (max-width: 768px) {
          .db-sb {
            position: fixed; inset-block: 0; left: 0;
            transform: translateX(-110%);
            box-shadow: 6px 0 32px rgba(0,0,0,0.55);
            transition: transform 0.28s cubic-bezier(0.16,1,0.3,1);
          }
          .db-sb.open { transform: translateX(0); }
        }

        /* head */
        .db-sb-head {
          padding: 18px 16px 16px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
        }
        .db-sb-logo {
          width: 30px; height: 30px; border-radius: 8px;
          background: var(--accent);
          display: flex; align-items: center; justify-content: center;
          color: #0a0808; flex-shrink: 0;
        }
        .db-sb-title {
          font-family: var(--font-d); font-size: 14.5px;
          font-weight: 700; letter-spacing: -0.01em; color: var(--text);
        }

        /* nav body */
        .db-sb-body { flex: 1; padding: 8px 8px 6px; display: flex; flex-direction: column; gap: 1px; }

        .db-sb-sec {
          font-size: 9px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--text-3);
          padding: 12px 10px 4px; margin-top: 4px;
        }
        .db-sb-sec:first-child { margin-top: 0; }

        .db-sb-link {
          display: flex; align-items: center; gap: 9px;
          padding: 7.5px 10px; border-radius: 9px;
          font-size: 13px; font-weight: 600; color: var(--text-2);
          text-decoration: none; position: relative;
          transition: background var(--ease), color var(--ease);
        }
        .db-sb-link:hover { background: rgba(255,255,255,0.04); color: var(--text); }
        .db-sb-link.on {
          background: var(--accent-s); color: var(--accent);
        }
        .db-sb-link.on::before {
          content: ''; position: absolute;
          left: 0; top: 22%; bottom: 22%;
          width: 3px; border-radius: 99px;
          background: var(--accent);
        }
        .db-sb-ico {
          width: 26px; height: 26px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04); color: var(--text-3); flex-shrink: 0;
          transition: background var(--ease), color var(--ease);
        }
        .db-sb-link:hover .db-sb-ico { background: rgba(255,255,255,0.07); color: var(--text-2); }
        .db-sb-link.on .db-sb-ico { background: rgba(var(--accent-rgb),0.13); color: var(--accent); }

        /* foot */
        .db-sb-foot { padding: 8px; border-top: 1px solid var(--border); flex-shrink: 0; }
        .db-sb-out {
          display: flex; align-items: center; gap: 9px; width: 100%;
          padding: 7.5px 10px; border-radius: 9px;
          background: transparent; border: none; cursor: pointer;
          font-family: var(--font-b); font-size: 13px; font-weight: 600;
          color: var(--text-2); text-align: left;
          transition: background var(--ease), color var(--ease);
        }
        .db-sb-out:hover { background: var(--danger-s); color: var(--danger); }
        .db-sb-out-ico {
          width: 26px; height: 26px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04); color: var(--text-3); flex-shrink: 0;
          transition: background var(--ease), color var(--ease);
        }
        .db-sb-out:hover .db-sb-out-ico { background: rgba(239,68,68,0.12); color: var(--danger); }

        /* ══ Mobile overlay ═══════════════════════════════════════ */
        .db-ov {
          display: none; position: fixed; inset: 0; z-index: 40;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
          opacity: 0; pointer-events: none;
          transition: opacity 0.25s ease;
        }
        @media (max-width: 768px) { .db-ov { display: block; } }
        .db-ov.open { opacity: 1; pointer-events: auto; }

        /* ══ Main ═════════════════════════════════════════════════ */
        .db-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

        /* topbar */
        .db-top {
          height: 50px; flex-shrink: 0;
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 22px; gap: 12px;
          position: sticky; top: 0; z-index: 30;
        }
        .db-top-left { display: flex; align-items: center; gap: 8px; }
        .db-burger {
          display: none; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 7px;
          border: 1px solid var(--border); background: var(--surface-2);
          color: var(--text-2); cursor: pointer;
          transition: background var(--ease), color var(--ease);
        }
        .db-burger:hover { background: var(--surface); color: var(--text); }
        @media (max-width: 768px) { .db-burger { display: flex; } }

        .db-crumb {
          display: flex; align-items: center; gap: 5px;
          font-size: 12.5px; font-weight: 600;
        }
        .db-crumb-root { color: var(--text-3); }
        .db-crumb-sep  { color: var(--text-3); opacity: 0.5; }
        .db-crumb-cur  { color: var(--text); }

        .db-top-right { display: flex; align-items: center; gap: 6px; }

        /* content */
        .db-page { flex: 1; overflow-y: auto; padding: 26px 26px 40px; }
        .db-page::-webkit-scrollbar { width: 4px; }
        .db-page::-webkit-scrollbar-track { background: transparent; }
        .db-page::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
        @media (max-width: 640px) { .db-page { padding: 18px 14px 32px; } }
      ` }} />

      <div className="db">
        {/* overlay */}
        <div className={cn("db-ov", open && "open")} onClick={() => setOpen(false)} />

        {/* ── Sidebar ──────────────────────────────────────────────── */}
        <aside className={cn("db-sb", open && "open")}>
          <div className="db-sb-head">
            <div className="db-sb-logo"><LayoutDashboard size={15} /></div>
            <span className="db-sb-title">Admin CMS</span>
          </div>

          <nav className="db-sb-body">
            {NAV.map((item, i) => {
              const active = isActive(item.href);
              const showSection =
                item.section &&
                (i === 0 || NAV[i - 1].section !== item.section);
              return (
                <div key={item.href}>
                  {showSection && (
                    <div className="db-sb-sec">{item.section}</div>
                  )}
                  <Link href={item.href} className={cn("db-sb-link", active && "on")}>
                    <span className="db-sb-ico"><item.icon size={13} /></span>
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="db-sb-foot">
            <button className="db-sb-out" onClick={handleLogout}>
              <span className="db-sb-out-ico"><LogOut size={13} /></span>
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main ─────────────────────────────────────────────────── */}
        <div className="db-main">
          <header className="db-top">
            <div className="db-top-left">
              <button
                className="db-burger"
                onClick={() => setOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu size={14} />
              </button>
              <div className="db-crumb">
                <span className="db-crumb-root">Dashboard</span>
                {activeItem && activeItem.href !== "/dashboard" && (
                  <>
                    <ChevronRight size={12} className="db-crumb-sep" />
                    <span className="db-crumb-cur">{activeItem.label}</span>
                  </>
                )}
              </div>
            </div>
            <div className="db-top-right">
              <ThemeToggle />
            </div>
          </header>

          <div className="db-page">{children}</div>
        </div>
      </div>
    </>
  );
}