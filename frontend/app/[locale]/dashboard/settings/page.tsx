"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save, Loader2, UploadCloud, X,
  Globe, ImageIcon, Sliders, Bell,
  ShieldCheck, ChevronRight, Check,
  RefreshCw, Pencil,
} from "lucide-react";
import { toast } from "sonner";

/* ── Sidebar nav sections ───────────────────────────────────────────────── */
const SECTIONS = [
  { id: "branding", label: "Branding", icon: ImageIcon, desc: "Logo & site identity" },
  { id: "general", label: "General", icon: Sliders, desc: "Name & locale" },
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Alert preferences" },
  { id: "security", label: "Security", icon: ShieldCheck, desc: "Access & sessions" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("branding");
  const [siteName, setSiteName] = useState("Web Tools Hub");
  const [savedName, setSavedName] = useState("Web Tools Hub");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsDirty(siteName !== savedName || !!logoFile || !!faviconFile);
  }, [siteName, logoFile, faviconFile, savedName]);

  useEffect(() => {
    fetch("http://localhost:3001/settings/public", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.siteName) {
          setSiteName(data.siteName);
          setSavedName(data.siteName);
        }
        if (data.siteLogoUrl) {
          setPreview(`http://localhost:3001${data.siteLogoUrl}`);
        }
        if (data.siteFaviconUrl) {
          setFaviconPreview(`http://localhost:3001${data.siteFaviconUrl}`);
        }
      })
      .catch(() => {});
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setLogoFile(f); setPreview(URL.createObjectURL(f));
  };

  const handleFavicon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFaviconFile(f); setFaviconPreview(URL.createObjectURL(f));
  };

  const removeLogo = () => { setLogoFile(null); setPreview(null); };
  const removeFavicon = () => { setFaviconFile(null); setFaviconPreview(null); };

  const handleSave = async () => {
    if (!isDirty || isSaving) return;
    setIsSaving(true);
    try {
      let finalLogoUrl: string | null = null;
      let finalFaviconUrl: string | null = null;
      if (logoFile) {
        const fd = new FormData(); fd.append("file", logoFile);
        const up = await fetch("http://localhost:3001/upload/image", {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
          body: fd, credentials: "include",
        });
        if (!up.ok) throw new Error("Image upload failed.");
        finalLogoUrl = (await up.json()).url;
      }
      if (faviconFile) {
        const fd = new FormData(); fd.append("file", faviconFile);
        const up = await fetch("http://localhost:3001/upload/image", {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
          body: fd, credentials: "include",
        });
        if (!up.ok) throw new Error("Favicon upload failed.");
        finalFaviconUrl = (await up.json()).url;
      }
      const res = await fetch("http://localhost:3001/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        credentials: "include",
        body: JSON.stringify({ 
          siteName, 
          ...(finalLogoUrl && { siteLogoUrl: finalLogoUrl }),
          ...(finalFaviconUrl && { siteFaviconUrl: finalFaviconUrl }) 
        }),
      });
      if (!res.ok) throw new Error("Failed to save settings.");
      setSavedName(siteName);
      setLogoFile(null);
      setFaviconFile(null);
      setIsDirty(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
      toast.success("Settings saved.");
      window.dispatchEvent(new Event("settingsUpdated"));
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setSiteName(savedName);
    removeLogo();
    removeFavicon();
    setIsDirty(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

        /* ── Tokens ─────────────────────────────────────────────── */
        .st {
          --bg:          #0c0c10;
          --panel:       #111115;
          --panel-2:     #18181e;
          --panel-3:     #1e1e26;
          --line:        rgba(255,255,255,0.06);
          --line-h:      rgba(255,255,255,0.11);
          --text:        #e8e9f2;
          --text-2:      rgba(210,212,235,0.48);
          --text-3:      rgba(190,193,220,0.26);
          --em:          #10b981;
          --em-rgb:      16,185,129;
          --em-s:        rgba(16,185,129,0.09);
          --em-h:        #34d399;
          --warn:        #f59e0b;
          --warn-s:      rgba(245,158,11,0.09);
          --danger:      #ef4444;
          --danger-s:    rgba(239,68,68,0.07);
          --font-d:      'DM Sans', sans-serif;
          --font-b:      'DM Sans', sans-serif;
          --font-m:      'DM Mono', monospace;
          --r:           10px;
          --ease:        0.18s cubic-bezier(0.4,0,0.2,1);

          font-family: var(--font-b);
          color: var(--text);
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* ── Top bar ─────────────────────────────────────────── */
        .st-topbar {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--line);
          margin-bottom: 28px;
        }
        .st-topbar-left { display: flex; flex-direction: column; gap: 3px; }
        .st-kicker {
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.10em;
          text-transform: uppercase; color: var(--em);
          display: flex; align-items: center; gap: 6px;
        }
        .st-kicker::before {
          content: ''; width: 16px; height: 2px;
          background: var(--em); border-radius: 2px;
        }
        .st-page-title {
          font-size: clamp(1.3rem,2.2vw,1.7rem);
          font-weight: 700; letter-spacing: -0.025em;
          color: var(--text); margin: 0;
        }

        /* ── Save / discard controls ──────────────────────────── */
        .st-controls {
          display: flex; align-items: center; gap: 8px;
        }
        .st-dirty-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 9999px;
          background: var(--warn-s);
          border: 1px solid rgba(245,158,11,0.22);
          font-size: 12px; font-weight: 600; color: var(--warn);
          animation: st-pop 0.2s ease;
        }
        @keyframes st-pop { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
        .st-dirty-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--warn); flex-shrink: 0;
          animation: st-blink 2s ease-in-out infinite;
        }
        @keyframes st-blink { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .st-saved-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 9999px;
          background: var(--em-s);
          border: 1px solid rgba(var(--em-rgb),0.22);
          font-size: 12px; font-weight: 600; color: var(--em);
          animation: st-pop 0.2s ease;
        }

        .st-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: var(--r);
          font-family: var(--font-b); font-size: 13px; font-weight: 600;
          cursor: pointer; border: 1px solid transparent;
          transition: all var(--ease);
        }
        .st-btn-ghost {
          background: transparent; color: var(--text-2);
          border-color: var(--line);
        }
        .st-btn-ghost:hover { background: var(--panel-2); color: var(--text); border-color: var(--line-h); }
        .st-btn-solid {
          background: var(--em); color: #031a10;
          border-color: transparent;
        }
        .st-btn-solid:hover:not(:disabled) {
          background: var(--em-h);
          box-shadow: 0 4px 16px rgba(var(--em-rgb),0.32);
          transform: translateY(-1px);
        }
        .st-btn-solid:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }

        /* ── Two-col layout ──────────────────────────────────── */
        .st-layout {
          display: grid;
          grid-template-columns: 210px 1fr;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 860px) {
          .st-layout { grid-template-columns: 1fr; }
          .st-sidenav { flex-direction: row; overflow-x: auto; padding-bottom: 4px; }
          .st-sidenav-item { flex-direction: row; text-align: left; flex-shrink: 0; }
          .st-sidenav-desc { display: none; }
        }

        /* ── Sidebar nav ─────────────────────────────────────── */
        .st-sidenav {
          display: flex; flex-direction: column; gap: 3px;
          position: sticky; top: 20px;
        }
        .st-sidenav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: var(--r);
          cursor: pointer; border: 1px solid transparent;
          transition: background var(--ease), border-color var(--ease);
          user-select: none;
        }
        .st-sidenav-item:hover { background: var(--panel-2); }
        .st-sidenav-item.on {
          background: var(--panel-2);
          border-color: var(--line);
        }
        .st-sidenav-ico {
          width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: var(--panel-3); color: var(--text-3);
          transition: background var(--ease), color var(--ease);
        }
        .st-sidenav-item.on .st-sidenav-ico { background: var(--em-s); color: var(--em); }
        .st-sidenav-text { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
        .st-sidenav-label {
          font-size: 13px; font-weight: 600; color: var(--text-2);
          transition: color var(--ease);
        }
        .st-sidenav-item.on .st-sidenav-label { color: var(--text); }
        .st-sidenav-desc { font-size: 11px; color: var(--text-3); }

        /* ── Main panel ──────────────────────────────────────── */
        .st-main { display: flex; flex-direction: column; gap: 14px; }

        /* ── Section card ────────────────────────────────────── */
        .st-section {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 14px; overflow: hidden;
        }
        .st-section-head {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 20px; border-bottom: 1px solid var(--line);
        }
        .st-section-head-ico {
          width: 36px; height: 36px; border-radius: 9px;
          background: var(--em-s);
          display: flex; align-items: center; justify-content: center;
          color: var(--em); flex-shrink: 0;
        }
        .st-section-head-text { display: flex; flex-direction: column; gap: 2px; }
        .st-section-title { font-size: 14px; font-weight: 600; color: var(--text); }
        .st-section-desc  { font-size: 12px; color: var(--text-2); }
        .st-section-body  { padding: 20px; display: flex; flex-direction: column; gap: 20px; }

        /* ── Field row ───────────────────────────────────────── */
        .st-field-row {
          display: grid; grid-template-columns: 200px 1fr;
          gap: 10px 20px; align-items: start;
        }
        @media (max-width: 640px) { .st-field-row { grid-template-columns: 1fr; } }
        .st-field-left { display: flex; flex-direction: column; gap: 3px; padding-top: 10px; }
        .st-field-label {
          font-size: 13px; font-weight: 600; color: var(--text);
        }
        .st-field-hint { font-size: 11.5px; color: var(--text-3); line-height: 1.55; }
        .st-field-right { display: flex; flex-direction: column; gap: 8px; }

        /* ── Input ───────────────────────────────────────────── */
        .st-input-wrap { position: relative; }
        .st-input {
          width: 100%; height: 40px;
          border-radius: var(--r); border: 1.5px solid var(--line);
          background: var(--panel-2); color: var(--text);
          font-family: var(--font-b); font-size: 14px; font-weight: 500;
          padding: 0 38px 0 13px; outline: none;
          transition: border-color var(--ease), box-shadow var(--ease);
        }
        .st-input::placeholder { color: var(--text-3); font-weight: 400; }
        .st-input:focus {
          border-color: rgba(var(--em-rgb), 0.5);
          box-shadow: 0 0 0 3px rgba(var(--em-rgb), 0.08);
        }
        .st-input-edit-ico {
          position: absolute; right: 11px; top: 50%;
          transform: translateY(-50%); color: var(--text-3); pointer-events: none;
        }
        .st-char-count {
          font-size: 11px; color: var(--text-3); text-align: right;
          font-family: var(--font-m);
        }

        /* ── Logo area ───────────────────────────────────────── */
        .st-logo-area {
          display: flex; gap: 14px; align-items: stretch;
          flex-wrap: wrap;
        }
        .st-logo-frame {
          position: relative; width: 110px; min-height: 72px;
          border-radius: var(--r);
          background: var(--panel-3); border: 1px solid var(--line);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; flex-shrink: 0;
          transition: border-color var(--ease);
        }
        .st-logo-frame:hover { border-color: var(--line-h); }
        .st-logo-frame img { max-width: 100%; max-height: 68px; object-fit: contain; padding: 6px; }
        .st-logo-placeholder {
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          color: var(--text-3);
        }
        .st-logo-placeholder-text { font-size: 10.5px; font-weight: 500; }
        .st-logo-remove-btn {
          position: absolute; top: 5px; right: 5px;
          width: 22px; height: 22px; border-radius: 6px;
          background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          color: #fff; cursor: pointer;
          opacity: 0; transition: opacity var(--ease);
        }
        .st-logo-frame:hover .st-logo-remove-btn { opacity: 1; }

        .st-logo-upload {
          flex: 1; min-width: 180px; min-height: 72px; border-radius: var(--r);
          border: 1.5px dashed var(--line);
          background: var(--panel-2);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 6px;
          cursor: pointer;
          transition: border-color var(--ease), background var(--ease);
        }
        .st-logo-upload:hover {
          border-color: rgba(var(--em-rgb), 0.4);
          background: var(--panel-3);
        }
        .st-upload-label { font-size: 12.5px; font-weight: 600; color: var(--text-2); }
        .st-upload-sub   { font-size: 11px; color: var(--text-3); }

        /* ── Field divider ───────────────────────────────────── */
        .st-field-sep { height: 1px; background: var(--line); margin: 2px 0; }

        /* ── Coming soon card ────────────────────────────────── */
        .st-coming {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 40px 24px;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 10px; text-align: center;
        }
        .st-coming-ico {
          width: 44px; height: 44px; border-radius: 12px;
          background: var(--panel-2);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-3);
        }
        .st-coming-title { font-size: 14px; font-weight: 600; color: var(--text-2); }
        .st-coming-sub   { font-size: 12.5px; color: var(--text-3); max-width: 280px; line-height: 1.55; }
        .st-coming-badge {
          font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; padding: 3px 9px; border-radius: 9999px;
          background: var(--panel-3); color: var(--text-3);
          border: 1px solid var(--line);
        }

        /* ── Section footer ──────────────────────────────────── */
        .st-section-foot {
          padding: 13px 20px; border-top: 1px solid var(--line);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 8px;
        }
        .st-foot-left {
          font-size: 11.5px; color: var(--text-3);
          display: flex; align-items: center; gap: 5px;
        }

        @keyframes st-spin { to { transform: rotate(360deg); } }

        /* ── Responsive ──────────────────────────────────────── */
        @media (max-width: 480px) {
          .st-topbar { flex-direction: column; align-items: flex-start; }
          .st-controls { width: 100%; justify-content: flex-end; }
        }
      ` }} />

      <div className="st">

        {/* ── Top bar ───────────────────────────────────────────────── */}
        <div className="st-topbar">
          <div className="st-topbar-left">
            <span className="st-kicker">Configuration</span>
            <h1 className="st-page-title">Settings</h1>
          </div>

          <div className="st-controls">
            {justSaved && !isDirty && (
              <div className="st-saved-pill">
                <Check size={12} /> Saved
              </div>
            )}
            {isDirty && (
              <div className="st-dirty-pill">
                <span className="st-dirty-dot" />
                Unsaved changes
              </div>
            )}
            {isDirty && (
              <button className="st-btn st-btn-ghost" onClick={handleDiscard}>
                <RefreshCw size={12} /> Discard
              </button>
            )}
            <button
              className="st-btn st-btn-solid"
              onClick={handleSave}
              disabled={isSaving || !isDirty}
            >
              {isSaving
                ? <><Loader2 size={13} style={{ animation: "st-spin 0.8s linear infinite" }} /> Saving…</>
                : <><Save size={13} /> Save Changes</>}
            </button>
          </div>
        </div>

        {/* ── Two-col layout ────────────────────────────────────────── */}
        <div className="st-layout">

          {/* Sidebar */}
          <nav className="st-sidenav">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  className={`st-sidenav-item${active === s.id ? " on" : ""}`}
                  onClick={() => setActive(s.id)}
                >
                  <div className="st-sidenav-ico"><Icon size={15} /></div>
                  <div className="st-sidenav-text">
                    <span className="st-sidenav-label">{s.label}</span>
                    <span className="st-sidenav-desc">{s.desc}</span>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Main content */}
          <div className="st-main">

            {/* ── Branding section ──────────────────────────────────── */}
            {active === "branding" && (
              <div className="st-section">
                <div className="st-section-head">
                  <div className="st-section-head-ico"><ImageIcon size={17} /></div>
                  <div className="st-section-head-text">
                    <span className="st-section-title">Branding</span>
                    <span className="st-section-desc">Your site's visual identity across all surfaces.</span>
                  </div>
                </div>

                <div className="st-section-body">

                  {/* Logo field */}
                  <div className="st-field-row">
                    <div className="st-field-left">
                      <span className="st-field-label">Site Logo</span>
                      <span className="st-field-hint">
                        Displayed in the navbar and footer. SVG or PNG recommended.
                      </span>
                    </div>
                    <div className="st-field-right">
                      <div className="st-logo-area">
                        <div className="st-logo-frame">
                          {preview ? (
                            <>
                              <img src={preview} alt="Logo preview" />
                              <button className="st-logo-remove-btn" onClick={removeLogo}>
                                <X size={11} />
                              </button>
                            </>
                          ) : (
                            <div className="st-logo-placeholder">
                              <ImageIcon size={20} />
                              <span className="st-logo-placeholder-text">No logo</span>
                            </div>
                          )}
                        </div>

                        <label htmlFor="st-logo-file" className="st-logo-upload">
                          <UploadCloud size={18} style={{ color: "var(--text-3)" }} />
                          <span className="st-upload-label">
                            {preview ? "Replace logo" : "Upload logo"}
                          </span>
                          <span className="st-upload-sub">SVG, PNG, JPG · max 5 MB</span>
                          <input
                            id="st-logo-file"
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFile}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Favicon field */}
                  <div className="st-field-row">
                    <div className="st-field-left">
                      <span className="st-field-label">Favicon</span>
                      <span className="st-field-hint">
                        Displayed in the browser tab. A small, square ICO or PNG is recommended.
                      </span>
                    </div>
                    <div className="st-field-right">
                      <div className="st-logo-area">
                        <div className="st-logo-frame">
                          {faviconPreview ? (
                            <>
                              <img src={faviconPreview} alt="Favicon preview" />
                              <button className="st-logo-remove-btn" onClick={removeFavicon}>
                                <X size={11} />
                              </button>
                            </>
                          ) : (
                            <div className="st-logo-placeholder">
                              <Globe size={20} />
                              <span className="st-logo-placeholder-text">No favicon</span>
                            </div>
                          )}
                        </div>

                        <label htmlFor="st-favicon-file" className="st-logo-upload">
                          <UploadCloud size={18} style={{ color: "var(--text-3)" }} />
                          <span className="st-upload-label">
                            {faviconPreview ? "Replace favicon" : "Upload favicon"}
                          </span>
                          <span className="st-upload-sub">ICO, PNG, SVG · max 1 MB</span>
                          <input
                            id="st-favicon-file"
                            ref={faviconRef}
                            type="file"
                            accept="image/*,.ico"
                            style={{ display: "none" }}
                            onChange={handleFavicon}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="st-section-foot">
                  <span className="st-foot-left">
                    <ShieldCheck size={12} />
                    Changes propagate site-wide after saving.
                  </span>
                </div>
              </div>
            )}

            {/* ── General section ───────────────────────────────────── */}
            {active === "general" && (
              <div className="st-section">
                <div className="st-section-head">
                  <div className="st-section-head-ico"><Sliders size={17} /></div>
                  <div className="st-section-head-text">
                    <span className="st-section-title">General</span>
                    <span className="st-section-desc">Core site identity and metadata.</span>
                  </div>
                </div>

                <div className="st-section-body">

                  {/* Site name */}
                  <div className="st-field-row">
                    <div className="st-field-left">
                      <span className="st-field-label">Site Name</span>
                      <span className="st-field-hint">
                        Appears in the browser tab, navbar, footer, and SEO metadata.
                      </span>
                    </div>
                    <div className="st-field-right">
                      <div className="st-input-wrap">
                        <input
                          className="st-input"
                          value={siteName}
                          onChange={e => setSiteName(e.target.value)}
                          placeholder="My Awesome Site"
                          maxLength={60}
                        />
                        <Pencil size={13} className="st-input-edit-ico" />
                      </div>
                      <span className="st-char-count">{siteName.length} / 60</span>
                    </div>
                  </div>

                  <div className="st-field-sep" />

                  {/* Site URL (display only) */}
                  <div className="st-field-row">
                    <div className="st-field-left">
                      <span className="st-field-label">Site URL</span>
                      <span className="st-field-hint">The public-facing base URL of this platform.</span>
                    </div>
                    <div className="st-field-right">
                      <div className="st-input-wrap">
                        <input
                          className="st-input"
                          defaultValue="https://webtoolshub.app"
                          readOnly
                          style={{ color: "var(--text-3)", cursor: "default" }}
                        />
                        <Globe size={13} className="st-input-edit-ico" />
                      </div>
                      <span style={{ fontSize: 11, color: "var(--text-3)" }}>
                        Configured via environment variables.
                      </span>
                    </div>
                  </div>

                </div>

                <div className="st-section-foot">
                  <span className="st-foot-left">
                    <ShieldCheck size={12} />
                    Changes propagate site-wide after saving.
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    {isDirty && (
                      <button className="st-btn st-btn-ghost" onClick={handleDiscard}>
                        <RefreshCw size={12} /> Discard
                      </button>
                    )}
                    <button
                      className="st-btn st-btn-solid"
                      onClick={handleSave}
                      disabled={isSaving || !isDirty}
                    >
                      {isSaving
                        ? <><Loader2 size={13} style={{ animation: "st-spin 0.8s linear infinite" }} /> Saving…</>
                        : <><Save size={13} /> Save</>}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Coming soon sections ───────────────────────────────── */}
            {(active === "notifications" || active === "security") && (() => {
              const sec = SECTIONS.find(s => s.id === active)!;
              const Icon = sec.icon;
              return (
                <div className="st-coming">
                  <div className="st-coming-ico"><Icon size={20} /></div>
                  <span className="st-coming-title">{sec.label} Settings</span>
                  <span className="st-coming-sub">
                    This section is being built. Configuration options will appear here in a future update.
                  </span>
                  <span className="st-coming-badge">Coming soon</span>
                </div>
              );
            })()}

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes st-spin { to { transform: rotate(360deg); } }` }} />
    </>
  );
}