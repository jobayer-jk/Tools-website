"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import {
  Save, UploadCloud, CalendarIcon, Bold, Italic,
  List, ListOrdered, Image as ImageIcon, Link as LinkIcon,
  Heading2, Heading3, Quote, Minus, Undo, Redo,
  ChevronLeft, Loader2, X,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";

/* ─────────────────────────────────────────────────────────────────────────────
   Shared editor CSS (imported once, used in new + edit pages)
───────────────────────────────────────────────────────────────────────────── */
const EDITOR_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600;700&display=swap');

  .ep {
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
    --green:      #22c55e;
    --font-d:     'Syne', sans-serif;
    --font-b:     'Manrope', sans-serif;
    --ease:       0.20s cubic-bezier(0.4,0,0.2,1);
    font-family: var(--font-b); color: var(--text);
  }

  /* ── Page header ──────────────────────────────────────────── */
  .ep-head {
    display: flex; align-items: center; flex-wrap: wrap;
    justify-content: space-between; gap: 14px; margin-bottom: 28px;
  }
  .ep-head-left { display: flex; flex-direction: column; gap: 4px; }
  .ep-eyebrow {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.10em;
    text-transform: uppercase; color: var(--accent);
  }
  .ep-eyebrow-line { width: 14px; height: 2px; background: var(--accent); border-radius: 2px; }
  .ep-title {
    font-family: var(--font-d);
    font-size: clamp(1.3rem,2.5vw,1.75rem);
    font-weight: 800; letter-spacing: -0.028em;
    color: var(--text); margin: 0;
  }

  .ep-head-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .ep-btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 9px;
    border: 1px solid var(--border); background: transparent;
    color: var(--text-2); font-family: var(--font-b);
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: background var(--ease), color var(--ease), border-color var(--ease);
    text-decoration: none;
  }
  .ep-btn-ghost:hover { background: var(--surface-2); color: var(--text); border-color: rgba(255,255,255,0.12); }

  .ep-btn-primary {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 18px; border-radius: 9px;
    background: var(--accent); color: #0a0808;
    font-family: var(--font-b); font-size: 13px; font-weight: 700;
    border: none; cursor: pointer;
    transition: background var(--ease), transform var(--ease), box-shadow var(--ease), opacity var(--ease);
  }
  .ep-btn-primary:hover:not(:disabled) {
    background: #fbbf24; transform: translateY(-1px);
    box-shadow: 0 4px 18px rgba(var(--accent-rgb),0.35);
  }
  .ep-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Layout grid ──────────────────────────────────────────── */
  .ep-grid {
    display: grid; grid-template-columns: 1fr 300px; gap: 16px;
    align-items: start;
  }
  @media (max-width: 1024px) { .ep-grid { grid-template-columns: 1fr; } }

  /* ── Panel ────────────────────────────────────────────────── */
  .ep-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden;
  }
  .ep-panel-head {
    padding: 14px 18px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .ep-panel-title {
    font-family: var(--font-d); font-size: 13px; font-weight: 700;
    color: var(--text); letter-spacing: -0.01em;
  }
  .ep-panel-body { padding: 18px; display: flex; flex-direction: column; gap: 16px; }

  /* ── Field ────────────────────────────────────────────────── */
  .ep-field { display: flex; flex-direction: column; gap: 6px; }
  .ep-label {
    font-size: 11px; font-weight: 700; letter-spacing: 0.07em;
    text-transform: uppercase; color: var(--text-3);
  }
  .ep-input {
    width: 100%; border-radius: 9px; border: 1.5px solid var(--border);
    background: var(--surface-2); color: var(--text);
    font-family: var(--font-b); font-size: 14px; outline: none;
    padding: 9px 13px;
    transition: border-color var(--ease), box-shadow var(--ease);
  }
  .ep-input::placeholder { color: var(--text-3); }
  .ep-input:focus {
    border-color: rgba(var(--accent-rgb),0.5);
    box-shadow: 0 0 0 3px rgba(var(--accent-rgb),0.09);
  }
  .ep-input.large { font-size: 17px; font-weight: 700; padding: 12px 14px; }

  /* ── Select ───────────────────────────────────────────────── */
  .ep-select {
    width: 100%; border-radius: 9px; border: 1.5px solid var(--border);
    background: var(--surface-2); color: var(--text);
    font-family: var(--font-b); font-size: 13px; font-weight: 600;
    padding: 9px 13px; outline: none; cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 34px;
    transition: border-color var(--ease);
  }
  .ep-select:focus { border-color: rgba(var(--accent-rgb),0.5); }

  /* ── Slug row ─────────────────────────────────────────────── */
  .ep-slug-row {
    display: flex; border-radius: 9px; border: 1.5px solid var(--border);
    background: var(--surface-2); overflow: hidden;
    transition: border-color var(--ease), box-shadow var(--ease);
  }
  .ep-slug-row:focus-within {
    border-color: rgba(var(--accent-rgb),0.5);
    box-shadow: 0 0 0 3px rgba(var(--accent-rgb),0.09);
  }
  .ep-slug-prefix {
    padding: 9px 11px; font-size: 12px; font-weight: 600;
    color: var(--text-3); border-right: 1px solid var(--border);
    white-space: nowrap; background: var(--surface-3);
    display: flex; align-items: center;
  }
  .ep-slug-input {
    flex: 1; background: transparent; border: none; outline: none;
    color: var(--text); font-family: var(--font-b); font-size: 13px;
    padding: 9px 12px;
  }
  .ep-slug-input::placeholder { color: var(--text-3); }

  /* ── Date button ──────────────────────────────────────────── */
  .ep-date-btn {
    display: flex; align-items: center; gap: 8px; width: 100%;
    padding: 9px 13px; border-radius: 9px;
    border: 1.5px solid var(--border); background: var(--surface-2);
    color: var(--text-2); font-family: var(--font-b); font-size: 13px;
    font-weight: 600; cursor: pointer; text-align: left;
    transition: border-color var(--ease), color var(--ease);
  }
  .ep-date-btn:hover { border-color: rgba(var(--accent-rgb),0.4); color: var(--text); }

  /* ── Divider ──────────────────────────────────────────────── */
  .ep-divider { height: 1px; background: var(--border); border: none; margin: 0 -18px; }

  /* ── Cover upload ─────────────────────────────────────────── */
  .ep-cover-zone {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 8px;
    height: 110px; border-radius: 10px;
    border: 1.5px dashed var(--border);
    background: var(--surface-2); cursor: pointer;
    transition: border-color var(--ease), background var(--ease);
  }
  .ep-cover-zone:hover { border-color: rgba(var(--accent-rgb),0.4); background: var(--surface-3); }
  .ep-cover-label { font-size: 12px; font-weight: 600; color: var(--text-2); }
  .ep-cover-sub   { font-size: 11px; color: var(--text-3); }
  .ep-cover-preview { position: relative; border-radius: 10px; overflow: hidden; }
  .ep-cover-preview img { width: 100%; height: 110px; object-fit: cover; display: block; }
  .ep-cover-remove {
    position: absolute; top: 6px; right: 6px;
    width: 24px; height: 24px; border-radius: 6px;
    background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
    color: #fff; cursor: pointer; opacity: 0;
    transition: opacity var(--ease);
  }
  .ep-cover-preview:hover .ep-cover-remove { opacity: 1; }

  /* ── Rich text toolbar ────────────────────────────────────── */
  .ep-toolbar {
    display: flex; align-items: center; flex-wrap: wrap; gap: 2px;
    padding: 8px 12px; border-bottom: 1px solid var(--border);
    background: var(--surface-2);
  }
  .ep-tb-btn {
    width: 30px; height: 30px; border-radius: 7px;
    border: none; background: transparent;
    color: var(--text-2); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background var(--ease), color var(--ease);
  }
  .ep-tb-btn:hover { background: var(--surface-3); color: var(--text); }
  .ep-tb-btn.active { background: var(--accent-s); color: var(--accent); }
  .ep-tb-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .ep-tb-sep { width: 1px; height: 18px; background: var(--border); margin: 0 4px; flex-shrink: 0; }

  /* ── Editor canvas ────────────────────────────────────────── */
  .ep-canvas {
    padding: 20px; min-height: 420px;
    color: var(--text);
  }
  .ep-canvas .ProseMirror { outline: none; min-height: 380px; }
  .ep-canvas .ProseMirror p { margin: 0 0 12px; line-height: 1.72; font-size: 14.5px; color: var(--text-2); }
  .ep-canvas .ProseMirror h2 { font-family: var(--font-d); font-size: 1.35rem; font-weight: 700; color: var(--text); margin: 20px 0 8px; letter-spacing: -0.02em; }
  .ep-canvas .ProseMirror h3 { font-family: var(--font-d); font-size: 1.1rem; font-weight: 700; color: var(--text); margin: 16px 0 6px; }
  .ep-canvas .ProseMirror strong { font-weight: 700; color: var(--text); }
  .ep-canvas .ProseMirror em { font-style: italic; color: var(--text-2); }
  .ep-canvas .ProseMirror ul,
  .ep-canvas .ProseMirror ol { padding-left: 22px; margin: 0 0 12px; color: var(--text-2); }
  .ep-canvas .ProseMirror li { margin-bottom: 5px; line-height: 1.65; font-size: 14.5px; }
  .ep-canvas .ProseMirror blockquote {
    border-left: 3px solid var(--accent); padding-left: 14px; margin: 14px 0;
    color: var(--text-2); font-style: italic;
  }
  .ep-canvas .ProseMirror hr { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
  .ep-canvas .ProseMirror img { max-width: 100%; border-radius: 10px; margin: 12px 0; }
  .ep-canvas .ProseMirror a { color: var(--accent); text-decoration: underline; text-decoration-color: rgba(var(--accent-rgb),0.4); }
  .ep-canvas .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    color: var(--text-3); pointer-events: none; float: left; height: 0;
  }
`;

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("blog");
  const [status, setStatus] = useState("DRAFT");
  const [publishedAt, setPublishedAt] = useState<Date | undefined>(new Date());
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      LinkExt.configure({ openOnClick: false }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "ep-canvas" },
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setTitle(v);
    setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!title || !slug) return toast.error("Title and slug are required.");
    if (!editor?.getText().trim()) return toast.error("Article content is empty.");
    setIsSaving(true);
    try {
      let finalCover: string | null = null;
      if (coverFile) {
        const fd = new FormData();
        fd.append("file", coverFile);
        const up = await fetch("http://localhost:3001/upload/image", {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
          body: fd, credentials: "include",
        });
        if (up.ok) finalCover = (await up.json()).url;
        else throw new Error("Image upload failed.");
      }
      const res = await fetch("http://localhost:3001/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ title, slug, category, content: editor?.getHTML(), coverImage: finalCover, status, publishedAt: publishedAt?.toISOString() }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to save article.");
      toast.success("Article saved.");
      router.push("/dashboard/articles");
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: EDITOR_STYLES }} />

      <div className="ep">
        {/* Head */}
        <div className="ep-head">
          <div className="ep-head-left">
            <div className="ep-eyebrow">
              <span className="ep-eyebrow-line" />
              New Article
            </div>
            <h1 className="ep-title">Create Article</h1>
          </div>
          <div className="ep-head-actions">
            <button className="ep-btn-ghost" onClick={() => router.back()}>
              <ChevronLeft size={14} /> Cancel
            </button>
            <button className="ep-btn-primary" onClick={handleSave} disabled={isSaving}>
              {isSaving
                ? <><Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} /> Saving…</>
                : <><Save size={14} /> Save Article</>}
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="ep-grid">

          {/* Editor */}
          <div className="ep-panel">
            <div className="ep-panel-head">
              <span className="ep-panel-title">Content Editor</span>
            </div>

            {/* Title input */}
            <div style={{ padding: "18px 18px 0" }}>
              <input
                className="ep-input large"
                placeholder="Article title…"
                value={title}
                onChange={handleTitleChange}
                style={{ width: "100%" }}
              />
            </div>

            {/* Toolbar */}
            <div className="ep-toolbar" style={{ marginTop: 14 }}>
              <button className="ep-tb-btn" title="Undo" onClick={() => editor?.chain().focus().undo().run()}><Undo size={13} /></button>
              <button className="ep-tb-btn" title="Redo" onClick={() => editor?.chain().focus().redo().run()}><Redo size={13} /></button>
              <span className="ep-tb-sep" />
              <button className={`ep-tb-btn${editor?.isActive("bold") ? " active" : ""}`} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold size={13} /></button>
              <button className={`ep-tb-btn${editor?.isActive("italic") ? " active" : ""}`} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic size={13} /></button>
              <span className="ep-tb-sep" />
              <button className={`ep-tb-btn${editor?.isActive("heading", { level: 2 }) ? " active" : ""}`} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={13} /></button>
              <button className={`ep-tb-btn${editor?.isActive("heading", { level: 3 }) ? " active" : ""}`} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={13} /></button>
              <span className="ep-tb-sep" />
              <button className={`ep-tb-btn${editor?.isActive("bulletList") ? " active" : ""}`} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List size={13} /></button>
              <button className={`ep-tb-btn${editor?.isActive("orderedList") ? " active" : ""}`} onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered size={13} /></button>
              <span className="ep-tb-sep" />
              <button className={`ep-tb-btn${editor?.isActive("blockquote") ? " active" : ""}`} onClick={() => editor?.chain().focus().toggleBlockquote().run()}><Quote size={13} /></button>
              <button className="ep-tb-btn" onClick={() => editor?.chain().focus().setHorizontalRule().run()}><Minus size={13} /></button>
              <span className="ep-tb-sep" />
              <button className="ep-tb-btn" onClick={() => { const url = prompt("Image URL"); if (url) editor?.chain().focus().setImage({ src: url }).run(); }}><ImageIcon size={13} /></button>
              <button className="ep-tb-btn" onClick={() => { const url = prompt("Link URL"); if (url) editor?.chain().focus().setLink({ href: url }).run(); }}><LinkIcon size={13} /></button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Publish settings */}
            <div className="ep-panel">
              <div className="ep-panel-head">
                <span className="ep-panel-title">Publish Settings</span>
              </div>
              <div className="ep-panel-body">
                <div className="ep-field">
                  <label className="ep-label">Status</label>
                  <select className="ep-select" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="DRAFT">Draft</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>

                <div className="ep-field">
                  <label className="ep-label">Publish Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="ep-date-btn">
                        <CalendarIcon size={13} />
                        {publishedAt ? format(publishedAt, "MMM dd, yyyy") : "Pick a date"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" style={{ padding: 0, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
                      <Calendar mode="single" selected={publishedAt} onSelect={setPublishedAt} />
                    </PopoverContent>
                  </Popover>
                </div>

                <hr className="ep-divider" />

                <div className="ep-field">
                  <label className="ep-label">Category</label>
                  <select className="ep-select" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="blog">Blog Post</option>
                    <option value="news">News & Releases</option>
                    <option value="guides">Guides</option>
                  </select>
                </div>

                <div className="ep-field">
                  <label className="ep-label">URL Slug</label>
                  <div className="ep-slug-row">
                    <span className="ep-slug-prefix">/{category}/</span>
                    <input
                      className="ep-slug-input"
                      value={slug}
                      onChange={e => setSlug(e.target.value)}
                      placeholder="my-post-slug"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cover image */}
            <div className="ep-panel">
              <div className="ep-panel-head">
                <span className="ep-panel-title">Cover Image</span>
              </div>
              <div className="ep-panel-body">
                {coverPreview ? (
                  <div className="ep-cover-preview">
                    <img src={coverPreview} alt="Cover" />
                    <button
                      className="ep-cover-remove"
                      onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="ep-cover" className="ep-cover-zone">
                    <UploadCloud size={20} style={{ color: "var(--text-3)" }} />
                    <span className="ep-cover-label">Upload cover image</span>
                    <span className="ep-cover-sub">PNG, JPG, WEBP</span>
                    <input id="ep-cover" type="file" accept="image/*" style={{ display: "none" }} onChange={handleCover} />
                  </label>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
    </>
  );
}