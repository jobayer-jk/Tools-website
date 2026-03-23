"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus, Edit2, Trash2, Eye, Calendar, Clock,
  Globe, FileText, Search, Filter, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type Article = {
  id: string;
  title: string;
  slug: string;
  status: "PUBLISHED" | "DRAFT" | "SCHEDULED";
  category: string;
  publishedAt: string | null;
};

export default function ArticlesDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("ALL");

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/articles/dashboard", {
        credentials: "include",
      });
      if (res.ok) {
        setArticles(await res.json());
      } else {
        setArticles([
          { id: "1", title: "Welcome to Web Tools Hub", slug: "welcome-post", status: "PUBLISHED", category: "blog", publishedAt: new Date().toISOString() },
          { id: "2", title: "Upcoming AI Features", slug: "ai-features-roadmap", status: "DRAFT", category: "news", publishedAt: null },
          { id: "3", title: "Guide: Using the Password Generator", slug: "password-generator-guide", status: "SCHEDULED", category: "guides", publishedAt: new Date(Date.now() + 86400000).toISOString() },
        ]);
        toast.info("Using mock data — backend not connected.");
      }
    } catch {
      toast.error("Failed to load articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this article?")) return;
    try {
      const res = await fetch(`http://localhost:3001/articles/${id}`, {
        method: "DELETE", credentials: "include",
      });
      if (res.ok) {
        toast.success("Article deleted.");
        setArticles((p) => p.filter((a) => a.id !== id));
      } else {
        toast.error("Failed to delete article.");
      }
    } catch {
      toast.error("Network error.");
    }
  };

  const filtered = articles.filter((a) => {
    const matchQ = a.title.toLowerCase().includes(query.toLowerCase());
    const matchF = filter === "ALL" || a.status === filter;
    return matchQ && matchF;
  });

  const STATUS_CONFIG = {
    PUBLISHED: { label: "Published", icon: Globe, color: "#22c55e", bg: "rgba(34,197,94,0.09)" },
    DRAFT: { label: "Draft", icon: Clock, color: "#9ca3af", bg: "rgba(156,163,175,0.09)" },
    SCHEDULED: { label: "Scheduled", icon: Calendar, color: "#f59e0b", bg: "rgba(245,158,11,0.09)" },
  } as const;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .ar {
          --accent:     #eab308;
          --accent-rgb: 234,179,8;
          --accent-s:   rgba(234,179,8,0.09);
          --surface:    #111118;
          --surface-2:  #17171f;
          --border:     rgba(255,255,255,0.065);
          --text:       #ecedf5;
          --text-2:     rgba(210,212,238,0.46);
          --text-3:     rgba(190,192,225,0.24);
          --danger:     #ef4444;
          --danger-s:   rgba(239,68,68,0.08);
          --green:      #22c55e;
          --font-d:     'Syne', sans-serif;
          --font-b:     'Manrope', sans-serif;
          --ease:       0.20s cubic-bezier(0.4,0,0.2,1);
          font-family: var(--font-b); color: var(--text);
        }

        /* ── Header ──────────────────────────────────────────────── */
        .ar-head {
          display: flex; flex-wrap: wrap; align-items: flex-end;
          justify-content: space-between; gap: 16px; margin-bottom: 28px;
        }
        .ar-eyebrow {
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.10em;
          text-transform: uppercase; color: var(--accent); margin-bottom: 5px;
        }
        .ar-eyebrow-line { width: 14px; height: 2px; background: var(--accent); border-radius: 2px; }
        .ar-title {
          font-family: var(--font-d);
          font-size: clamp(1.35rem,2.5vw,1.8rem);
          font-weight: 800; letter-spacing: -0.028em; color: var(--text); margin: 0 0 5px;
        }
        .ar-sub { font-size: 13px; color: var(--text-2); margin: 0; }

        /* ── New button ──────────────────────────────────────────── */
        .ar-new-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 10px;
          background: var(--accent); color: #0a0808;
          font-family: var(--font-b); font-size: 13px; font-weight: 700;
          border: none; cursor: pointer; text-decoration: none; white-space: nowrap;
          transition: background var(--ease), transform var(--ease), box-shadow var(--ease);
        }
        .ar-new-btn:hover {
          background: #fbbf24; transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(var(--accent-rgb),0.35);
        }

        /* ── Toolbar ─────────────────────────────────────────────── */
        .ar-toolbar {
          display: flex; align-items: center; flex-wrap: wrap; gap: 10px;
          margin-bottom: 18px;
        }
        .ar-search {
          position: relative; flex: 1; min-width: 200px; max-width: 320px;
        }
        .ar-search-ico {
          position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
          color: var(--text-3); pointer-events: none;
        }
        .ar-search-input {
          width: 100%; height: 38px; padding: 0 12px 0 36px;
          border-radius: 9px; border: 1px solid var(--border);
          background: var(--surface); color: var(--text);
          font-family: var(--font-b); font-size: 13px; outline: none;
          transition: border-color var(--ease), box-shadow var(--ease);
        }
        .ar-search-input::placeholder { color: var(--text-3); }
        .ar-search-input:focus {
          border-color: rgba(var(--accent-rgb),0.45);
          box-shadow: 0 0 0 3px rgba(var(--accent-rgb),0.08);
        }

        /* ── Filter pills ────────────────────────────────────────── */
        .ar-filters { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
        .ar-pill {
          padding: 5px 13px; border-radius: 9999px;
          border: 1px solid var(--border);
          background: transparent; color: var(--text-2);
          font-family: var(--font-b); font-size: 12px; font-weight: 600;
          cursor: pointer;
          transition: background var(--ease), color var(--ease), border-color var(--ease);
        }
        .ar-pill:hover { background: var(--surface-2); color: var(--text); }
        .ar-pill.on {
          background: var(--accent-s); color: var(--accent);
          border-color: rgba(var(--accent-rgb),0.3);
        }

        /* ── Table card ──────────────────────────────────────────── */
        .ar-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden;
        }
        .ar-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .ar-table thead tr {
          border-bottom: 1px solid var(--border);
        }
        .ar-table th {
          padding: 11px 16px; text-align: left;
          font-size: 10.5px; font-weight: 700; letter-spacing: 0.09em;
          text-transform: uppercase; color: var(--text-3);
          white-space: nowrap;
        }
        .ar-table th:last-child { text-align: right; }
        .ar-table tbody tr {
          border-bottom: 1px solid var(--border);
          transition: background var(--ease);
        }
        .ar-table tbody tr:last-child { border-bottom: none; }
        .ar-table tbody tr:hover { background: rgba(255,255,255,0.02); }
        .ar-table td { padding: 13px 16px; vertical-align: middle; }
        .ar-table td:last-child { text-align: right; }

        .ar-art-title {
          font-weight: 600; color: var(--text); line-height: 1.35;
          max-width: 280px; overflow: hidden;
          text-overflow: ellipsis; white-space: nowrap;
        }
        .ar-art-slug { font-size: 11.5px; color: var(--text-3); margin-top: 2px; }

        /* ── Category chip ───────────────────────────────────────── */
        .ar-cat {
          display: inline-flex; align-items: center;
          padding: 3px 9px; border-radius: 5px;
          font-size: 11px; font-weight: 600; text-transform: capitalize;
          background: var(--surface-2); color: var(--text-2);
        }

        /* ── Status badge ────────────────────────────────────────── */
        .ar-status {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 9999px;
          font-size: 11px; font-weight: 700;
        }

        /* ── Date ────────────────────────────────────────────────── */
        .ar-date { font-size: 12.5px; color: var(--text-2); white-space: nowrap; }

        /* ── Action buttons ──────────────────────────────────────── */
        .ar-actions { display: flex; align-items: center; justify-content: flex-end; gap: 4px; }
        .ar-action-btn {
          width: 30px; height: 30px; border-radius: 7px;
          border: 1px solid var(--border);
          background: transparent; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-3); text-decoration: none;
          transition: background var(--ease), color var(--ease), border-color var(--ease);
        }
        .ar-action-btn:hover { background: var(--surface-2); color: var(--text); border-color: rgba(255,255,255,0.12); }
        .ar-action-btn.del:hover { background: var(--danger-s); color: var(--danger); border-color: rgba(239,68,68,0.2); }

        /* ── Empty / Loading ─────────────────────────────────────── */
        .ar-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 10px;
          padding: 56px 24px; color: var(--text-3);
        }
        .ar-empty-ico {
          width: 44px; height: 44px; border-radius: 12px;
          background: var(--surface-2);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-3);
        }
        .ar-empty-label { font-size: 13.5px; font-weight: 600; color: var(--text-2); }
        .ar-empty-sub   { font-size: 12px; color: var(--text-3); }

        /* ── Responsive ──────────────────────────────────────────── */
        .ar-scroll { overflow-x: auto; }
        @media (max-width: 640px) {
          .ar-head { flex-direction: column; align-items: flex-start; }
          .ar-table .ar-hide-sm { display: none; }
        }
      ` }} />

      <div className="ar">
        {/* Head */}
        <div className="ar-head">
          <div>
            <div className="ar-eyebrow">
              <span className="ar-eyebrow-line" />
              <FileText size={10} />
              Content
            </div>
            <h1 className="ar-title">Articles</h1>
            <p className="ar-sub">Manage your blog posts, guides and news updates.</p>
          </div>
          <Link href="/dashboard/articles/new" className="ar-new-btn">
            <Plus size={14} /> Write Article
          </Link>
        </div>

        {/* Toolbar */}
        <div className="ar-toolbar">
          <div className="ar-search">
            <Search size={13} className="ar-search-ico" />
            <input
              className="ar-search-input"
              placeholder="Search articles…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="ar-filters">
            {["ALL", "PUBLISHED", "DRAFT", "SCHEDULED"].map(f => (
              <button
                key={f}
                className={`ar-pill${filter === f ? " on" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="ar-card">
          <div className="ar-scroll">
            <table className="ar-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th className="ar-hide-sm">Category</th>
                  <th>Status</th>
                  <th className="ar-hide-sm">Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="ar-empty">
                        <Loader2 size={22} style={{ animation: "spin 0.8s linear infinite" }} />
                        <span className="ar-empty-label">Loading articles…</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="ar-empty">
                        <div className="ar-empty-ico"><FileText size={18} /></div>
                        <span className="ar-empty-label">No articles found</span>
                        <span className="ar-empty-sub">
                          {query ? "Try a different search term." : "Start by writing your first article."}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((article) => {
                    const cfg = STATUS_CONFIG[article.status];
                    const Icon = cfg.icon;
                    return (
                      <tr key={article.id}>
                        <td>
                          <div className="ar-art-title">{article.title}</div>
                          <div className="ar-art-slug">/{article.category}/{article.slug}</div>
                        </td>
                        <td className="ar-hide-sm">
                          <span className="ar-cat">{article.category}</span>
                        </td>
                        <td>
                          <span
                            className="ar-status"
                            style={{ background: cfg.bg, color: cfg.color }}
                          >
                            <Icon size={11} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="ar-hide-sm">
                          <span className="ar-date">
                            {article.publishedAt
                              ? format(new Date(article.publishedAt), "MMM dd, yyyy")
                              : "—"}
                          </span>
                        </td>
                        <td>
                          <div className="ar-actions">
                            <a
                              href={`/${article.category}/${article.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="ar-action-btn"
                              title="Preview"
                            >
                              <Eye size={13} />
                            </a>
                            <Link
                              href={`/dashboard/articles/${article.id}/edit`}
                              className="ar-action-btn"
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </Link>
                            <button
                              className="ar-action-btn del"
                              title="Delete"
                              onClick={() => handleDelete(article.id)}
                            >
                              <Trash2 size={13} />
                            </button>
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

      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
    </>
  );
}