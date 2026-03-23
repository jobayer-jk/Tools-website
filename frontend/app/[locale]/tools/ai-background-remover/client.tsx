"use client";

import { useState, useRef, ChangeEvent, useCallback } from "react";
import {
  UploadCloud, Download, Image as ImageIcon,
  Trash2, Cpu, Sparkles, CheckCircle2,
  FileImage, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { removeBackground, Config } from "@imgly/background-removal";

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------ */
function fmtBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */
export function BackgroundRemoverClient() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [resultSrc, setResultSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProc, setIsProc] = useState(false);
  const [progMsg, setProgMsg] = useState("");
  const [progVal, setProgVal] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (resultSrc) URL.revokeObjectURL(resultSrc);
    setImageFile(file);
    setImageSrc(URL.createObjectURL(file));
    setResultSrc(null);
  }, [imageSrc, resultSrc]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const clearAll = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (resultSrc) URL.revokeObjectURL(resultSrc);
    setImageFile(null); setImageSrc(null); setResultSrc(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const executeRemoval = async () => {
    if (!imageFile) return;
    try {
      setIsProc(true);
      setProgMsg("Loading AI model...");
      setProgVal(8);

      const config: Config = {
        progress: (key: string, cur: number, total: number) => {
          if (key === "compute:inference") {
            setProgMsg("Running neural inference...");
            setProgVal(70 + Math.round((cur / total) * 28));
          } else if (key.startsWith("fetch:")) {
            setProgMsg("Downloading model weights...");
            setProgVal(8 + Math.round((cur / total) * 55));
          }
        },
      };

      const blob = await removeBackground(imageFile, config);
      setResultSrc(URL.createObjectURL(blob));
      toast.success("Background removed!");
    } catch {
      toast.error("AI processing failed. Try a smaller image.");
    } finally {
      setIsProc(false);
      setProgMsg(""); setProgVal(0);
    }
  };

  const download = () => {
    if (!resultSrc || !imageFile) return;
    const a = document.createElement("a");
    a.href = resultSrc;
    a.download = `${imageFile.name.replace(/\.[^/.]+$/, "")}-nobg.png`;
    a.click();
    toast.success("Image downloaded!");
  };

  /* state shorthand */
  const hasImage = !!imageSrc;
  const hasResult = !!resultSrc;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        /* --- tokens --- */
        .br {
          --em:      #059669;
          --em-rgb:  5,150,105;
          --em-s:    rgba(5,150,105,0.08);
          --em-h:    #10b981;
          --warm:    #d97706;
          --rose:    #e11d48;
          --surface: var(--card, #fff);
          --surf-2:  var(--muted, #f0ede6);
          --border:  var(--border, rgba(0,0,0,0.09));
          --text:    var(--foreground, #1a1a14);
          --text-2:  var(--muted-foreground, rgba(26,26,20,.52));
          --text-3:  rgba(26,26,20,.28);
          --sh:      0 1px 4px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
          --sh-md:   0 4px 20px rgba(0,0,0,.08);
          --r:       12px;
          --font-d:  'Outfit', sans-serif;
          --font-b:  'DM Sans', sans-serif;
          --ease:    0.22s cubic-bezier(0.4,0,0.2,1);
          font-family: var(--font-b);
        }
        .dark .br {
          --em:      #10b981;
          --em-rgb:  16,185,129;
          --em-s:    rgba(16,185,129,0.10);
          --em-h:    #34d399;
          --warm:    #f59e0b;
          --rose:    #fb7185;
          --text-3:  rgba(230,228,215,.24);
        }

        /* --- layout --- */
        .br-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          align-items: start;
        }
        @media(max-width:820px) {
          .br-grid { grid-template-columns: 1fr; }
        }

        /* --- panel card --- */
        .br-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r);
          box-shadow: var(--sh);
          overflow: hidden;
          display: flex; flex-direction: column;
          min-height: 460px;
        }

        /* --- panel header --- */
        .br-panel-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .br-panel-head-left {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-d); font-size: 13.5px; font-weight: 700;
          color: var(--text); letter-spacing: -0.01em;
        }
        .br-panel-ico {
          width: 28px; height: 28px; border-radius: 7px;
          background: var(--em-s); color: var(--em);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .br-tag {
          font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; padding: 3px 9px; border-radius: 9999px;
          background: rgba(var(--em-rgb),0.10); color: var(--em);
        }

        /* --- clear button --- */
        .br-clear-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 8px;
          border: 1px solid var(--border); background: transparent;
          font-family: var(--font-b); font-size: 12px; font-weight: 600;
          color: var(--text-2); cursor: pointer;
          transition: background var(--ease), color var(--ease),
                      border-color var(--ease);
        }
        .br-clear-btn:hover {
          background: rgba(225,29,72,0.07); color: var(--rose);
          border-color: rgba(225,29,72,0.25);
        }

        /* --- panel body --- */
        .br-panel-body {
          flex: 1; display: flex; flex-direction: column;
          padding: 18px;
        }

        /* --- drop zone --- */
        .br-drop {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 14px; padding: 32px 20px;
          border: 1.5px dashed var(--border);
          border-radius: var(--r);
          cursor: pointer; text-align: center;
          transition: border-color var(--ease), background var(--ease);
          min-height: 320px;
        }
        .br-drop:hover, .br-drop.drag {
          border-color: rgba(var(--em-rgb),0.5);
          background: var(--em-s);
        }
        .br-drop.drag { background: rgba(var(--em-rgb),0.06); }

        .br-drop-ico-wrap {
          width: 56px; height: 56px; border-radius: 16px;
          background: var(--surf-2);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-2);
          transition: background var(--ease), color var(--ease);
        }
        .br-drop:hover .br-drop-ico-wrap,
        .br-drop.drag .br-drop-ico-wrap {
          background: rgba(var(--em-rgb),0.12); color: var(--em);
        }
        .br-drop-title {
          font-family: var(--font-d); font-size: 16px; font-weight: 700;
          color: var(--text);
        }
        .br-drop-sub {
          font-size: 12.5px; color: var(--text-2); line-height: 1.55;
          max-width: 240px;
        }
        .br-drop-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 18px; border-radius: 9px;
          background: var(--em); color: #fff;
          font-family: var(--font-b); font-size: 13px; font-weight: 600;
          border: none; cursor: pointer;
          transition: background var(--ease), transform var(--ease);
        }
        .br-drop-btn:hover { background: var(--em-h); transform: translateY(-1px); }
        .br-drop-formats {
          font-size: 11px; color: var(--text-3);
        }

        /* --- image preview --- */
        .br-img-wrap {
          flex: 1; display: flex; flex-direction: column; gap: 14px;
        }
        .br-img-frame {
          flex: 1; display: flex; align-items: center; justify-content: center;
          border-radius: var(--r); overflow: hidden;
          background: var(--surf-2);
          border: 1px solid var(--border);
          min-height: 280px; padding: 12px;
        }
        .br-img-frame img {
          max-height: 280px; width: auto; max-width: 100%;
          border-radius: 8px; display: block;
        }
        .br-img-meta {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px; padding: 10px 12px; border-radius: 9px;
          background: var(--surf-2); border: 1px solid var(--border);
          flex-shrink: 0;
        }
        .br-img-meta-left {
          display: flex; align-items: center; gap: 8px; min-width: 0;
        }
        .br-img-meta-ico {
          width: 28px; height: 28px; border-radius: 7px;
          background: rgba(var(--em-rgb),0.10); color: var(--em);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .br-img-name {
          font-size: 13px; font-weight: 600; color: var(--text);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .br-img-size {
          font-size: 11.5px; color: var(--text-2); flex-shrink: 0;
        }

        /* --- empty state --- */
        .br-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 12px; text-align: center; padding: 32px 20px;
          min-height: 320px;
        }
        .br-empty-ico {
          width: 56px; height: 56px; border-radius: 16px;
          background: var(--surf-2);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-3);
        }
        .br-empty-title {
          font-family: var(--font-d); font-size: 15px; font-weight: 700;
          color: var(--text-2);
        }
        .br-empty-sub { font-size: 12.5px; color: var(--text-3); max-width: 220px; line-height: 1.55; }

        /* --- action state (ready to process) --- */
        .br-action-state {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 18px; padding: 32px 20px; text-align: center;
          min-height: 320px;
        }
        .br-run-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; max-width: 280px; height: 52px;
          border-radius: 14px; border: none; cursor: pointer;
          background: var(--em); color: #fff;
          font-family: var(--font-d); font-size: 15px; font-weight: 700;
          letter-spacing: -0.01em;
          box-shadow: 0 4px 18px rgba(var(--em-rgb),0.35);
          transition: background var(--ease), transform var(--ease), box-shadow var(--ease);
        }
        .br-run-btn:hover {
          background: var(--em-h);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(var(--em-rgb),0.4);
        }
        .br-run-btn:active { transform: translateY(0); }
        .br-run-note {
          font-size: 12px; color: var(--text-2); line-height: 1.6;
          max-width: 260px;
        }

        /* --- processing state --- */
        .br-proc-state {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 20px; padding: 32px 20px; text-align: center;
          min-height: 320px;
        }
        .br-proc-ico-wrap {
          width: 64px; height: 64px; border-radius: 20px;
          background: var(--em-s);
          display: flex; align-items: center; justify-content: center;
          color: var(--em);
          animation: br-pulse 1.8s ease-in-out infinite;
        }
        @keyframes br-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(var(--em-rgb),0.25); }
          50%      { box-shadow: 0 0 0 12px rgba(var(--em-rgb),0); }
        }
        .br-proc-msg {
          font-size: 13.5px; font-weight: 600; color: var(--text);
          max-width: 240px; line-height: 1.5;
        }
        .br-progress-track {
          width: 100%; max-width: 280px; height: 6px;
          background: var(--surf-2);
          border: 1px solid var(--border);
          border-radius: 9999px; overflow: hidden;
        }
        .br-progress-fill {
          height: 100%; background: var(--em);
          border-radius: 9999px;
          transition: width 0.4s ease;
        }
        .br-proc-pct {
          font-family: 'DM Mono', monospace;
          font-size: 12px; font-weight: 500; color: var(--text-2);
        }

        /* --- result state --- */
        .br-result-state {
          flex: 1; display: flex; flex-direction: column; gap: 14px;
        }
        .br-checker {
          flex: 1; display: flex; align-items: center; justify-content: center;
          border-radius: var(--r); overflow: hidden;
          border: 1px solid var(--border);
          min-height: 280px; padding: 12px;
          background-image:
            linear-gradient(45deg, #e8e6df 25%, transparent 25%),
            linear-gradient(-45deg, #e8e6df 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e8e6df 75%),
            linear-gradient(-45deg, transparent 75%, #e8e6df 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          background-color: #f5f3ee;
        }
        .dark .br-checker {
          background-image:
            linear-gradient(45deg, #1e1e18 25%, transparent 25%),
            linear-gradient(-45deg, #1e1e18 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #1e1e18 75%),
            linear-gradient(-45deg, transparent 75%, #1e1e18 75%);
          background-color: #161610;
        }
        .br-checker img {
          max-height: 280px; width: auto; max-width: 100%;
          border-radius: 8px; display: block;
          filter: drop-shadow(0 4px 16px rgba(0,0,0,0.18));
        }

        .br-result-footer { flex-shrink: 0; }
        .br-success-row {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 12px; border-radius: 9px; margin-bottom: 12px;
          background: rgba(var(--em-rgb),0.08);
          border: 1px solid rgba(var(--em-rgb),0.18);
          font-size: 12.5px; font-weight: 600; color: var(--em);
        }
        .br-dl-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; height: 48px; border-radius: var(--r);
          background: var(--em); color: #fff; border: none; cursor: pointer;
          font-family: var(--font-d); font-size: 14.5px; font-weight: 700;
          box-shadow: 0 4px 14px rgba(var(--em-rgb),0.30);
          transition: background var(--ease), transform var(--ease), box-shadow var(--ease);
        }
        .br-dl-btn:hover {
          background: var(--em-h);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(var(--em-rgb),0.38);
        }
        .br-again-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; height: 38px; border-radius: var(--r); margin-top: 8px;
          background: transparent; border: 1px solid var(--border);
          font-family: var(--font-b); font-size: 13px; font-weight: 600;
          color: var(--text-2); cursor: pointer;
          transition: background var(--ease), color var(--ease), border-color var(--ease);
        }
        .br-again-btn:hover {
          background: var(--surf-2); color: var(--text);
          border-color: rgba(var(--em-rgb),0.25);
        }

        /* --- how it works strip --- */
        .br-how {
          margin-top: 20px; padding: 18px 20px;
          background: var(--surf-2); border: 1px solid var(--border);
          border-radius: var(--r);
          display: flex; align-items: center; flex-wrap: wrap;
          gap: 6px 24px;
        }
        .br-how-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--text-3); white-space: nowrap;
        }
        .br-how-steps {
          display: flex; align-items: center; flex-wrap: wrap; gap: 6px 0;
          flex: 1;
        }
        .br-how-step {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 500; color: var(--text-2);
        }
        .br-how-step-num {
          width: 18px; height: 18px; border-radius: 50%;
          background: rgba(var(--em-rgb),0.12); color: var(--em);
          font-size: 10px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .br-how-arrow {
          color: var(--text-3); padding: 0 4px; font-size: 12px;
          user-select: none;
        }

        /* --- responsive --- */
        @media(max-width:640px) {
          .br-panel { min-height: 380px; }
          .br-drop  { padding: 24px 14px; min-height: 260px; }
          .br-empty { min-height: 260px; padding: 24px 14px; }
          .br-action-state { min-height: 260px; }
          .br-proc-state   { min-height: 260px; }
          .br-checker      { min-height: 220px; }
          .br-how { gap: 8px; }
        }
      `}</style>

      <div className="br">
        <div className="br-grid">

          {/* ---- LEFT PANEL: Source image ---- */}
          <div className="br-panel">
            <div className="br-panel-head">
              <div className="br-panel-head-left">
                <div className="br-panel-ico"><ImageIcon size={14} /></div>
                Source Image
              </div>
              {hasImage && (
                <button className="br-clear-btn" onClick={clearAll}>
                  <Trash2 size={12} /> Clear
                </button>
              )}
            </div>

            <div className="br-panel-body">
              {!hasImage ? (
                /* Drop zone */
                <div
                  className={`br-drop${isDragging ? " drag" : ""}`}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === "Enter" && fileRef.current?.click()}
                  aria-label="Upload image"
                >
                  <div className="br-drop-ico-wrap">
                    <UploadCloud size={26} />
                  </div>
                  <div>
                    <div className="br-drop-title">Drop your image here</div>
                    <div className="br-drop-sub">
                      Works best with people, products, and animals
                    </div>
                  </div>
                  <button className="br-drop-btn" type="button" tabIndex={-1}>
                    <UploadCloud size={14} /> Browse Files
                  </button>
                  <div className="br-drop-formats">JPG, PNG, WEBP, GIF - up to 20 MB</div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleInput}
                  />
                </div>
              ) : (
                /* Image preview */
                <div className="br-img-wrap">
                  <div className="br-img-frame">
                    <img src={imageSrc!} alt="Source" />
                  </div>
                  <div className="br-img-meta">
                    <div className="br-img-meta-left">
                      <div className="br-img-meta-ico"><FileImage size={14} /></div>
                      <span className="br-img-name">{imageFile?.name}</span>
                    </div>
                    <span className="br-img-size">{fmtBytes(imageFile?.size ?? 0)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ---- RIGHT PANEL: Result ---- */}
          <div className="br-panel">
            <div className="br-panel-head">
              <div className="br-panel-head-left">
                <div className="br-panel-ico"><Sparkles size={14} /></div>
                Result
              </div>
              {hasResult && <span className="br-tag">Transparent PNG</span>}
            </div>

            <div className="br-panel-body">

              {/* State 1: no image uploaded yet */}
              {!hasImage && (
                <div className="br-empty">
                  <div className="br-empty-ico"><Sparkles size={24} /></div>
                  <div className="br-empty-title">Waiting for image</div>
                  <div className="br-empty-sub">
                    Upload an image on the left to get started.
                  </div>
                </div>
              )}

              {/* State 2: image uploaded, not processed */}
              {hasImage && !hasResult && !isProc && (
                <div className="br-action-state">
                  <button className="br-run-btn" onClick={executeRemoval}>
                    <Sparkles size={18} />
                    Remove Background
                  </button>
                  <p className="br-run-note">
                    AI runs entirely in your browser. First run downloads model
                    weights (~5 MB). Takes 5-20 seconds.
                  </p>
                </div>
              )}

              {/* State 3: processing */}
              {isProc && (
                <div className="br-proc-state">
                  <div className="br-proc-ico-wrap">
                    <Cpu size={28} />
                  </div>
                  <div className="br-proc-msg">{progMsg}</div>
                  <div className="br-progress-track">
                    <div className="br-progress-fill" style={{ width: `${progVal}%` }} />
                  </div>
                  <div className="br-proc-pct">{progVal}%</div>
                </div>
              )}

              {/* State 4: result ready */}
              {hasResult && !isProc && (
                <div className="br-result-state">
                  <div className="br-checker">
                    <img src={resultSrc!} alt="Result without background" />
                  </div>
                  <div className="br-result-footer">
                    <div className="br-success-row">
                      <CheckCircle2 size={14} />
                      Background removed successfully
                    </div>
                    <button className="br-dl-btn" onClick={download}>
                      <Download size={16} />
                      Download PNG
                    </button>
                    <button className="br-again-btn" onClick={clearAll}>
                      Process another image
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* How it works strip */}
        <div className="br-how">
          <span className="br-how-label">How it works</span>
          <div className="br-how-steps">
            {[
              "Upload your image",
              "AI isolates the subject",
              "Download transparent PNG",
            ].map((step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center" }}>
                <div className="br-how-step">
                  <span className="br-how-step-num">{i + 1}</span>
                  {step}
                </div>
                {i < 2 && <span className="br-how-arrow">-&gt;</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}