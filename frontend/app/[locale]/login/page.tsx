"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Invalid credentials");
      const data = await response.json();
      localStorage.setItem("admin_token", data.token);
      toast.success("Login Successful!");
      router.push("/dashboard/articles");
    } catch (err: any) {
      toast.error(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Manrope:wght@400;500;600&display=swap');

        /* ── Tokens ─────────────────────────────────────────────────── */
        .lp {
          --bg:         #0a0a0f;
          --panel:      #111118;
          --panel-2:    #18181f;
          --border:     rgba(255,255,255,0.07);
          --border-f:   rgba(234,179,8,0.45);
          --text:       #f0f0f8;
          --text-2:     rgba(220,220,240,0.48);
          --text-3:     rgba(200,200,230,0.28);
          --accent:     #eab308;
          --accent-rgb: 234,179,8;
          --accent-s:   rgba(234,179,8,0.10);
          --accent-h:   #fbbf24;
          --font-d:     'Syne', sans-serif;
          --font-b:     'Manrope', sans-serif;
          --radius:     13px;
          --ease:       0.22s cubic-bezier(0.4,0,0.2,1);
        }

        /* ── Shell ───────────────────────────────────────────────────── */
        .lp {
          min-height: 100vh;
          background: var(--bg);
          font-family: var(--font-b);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* ── Background grid ─────────────────────────────────────────── */
        .lp-grid {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 65% 75% at 50% 50%, black 20%, transparent 85%);
        }

        /* ── Glow orb ────────────────────────────────────────────────── */
        .lp-orb {
          position: absolute; pointer-events: none; z-index: 0;
          border-radius: 50%; filter: blur(100px);
          width: 500px; height: 500px;
          background: radial-gradient(circle,
            rgba(234,179,8,0.08) 0%, transparent 65%);
          top: 50%; left: 50%;
          transform: translate(-50%, -55%);
          animation: lp-float 8s ease-in-out infinite;
        }
        @keyframes lp-float {
          0%,100% { transform: translate(-50%, -55%) scale(1); }
          50%      { transform: translate(-50%, -48%) scale(1.06); }
        }

        /* ── Card ────────────────────────────────────────────────────── */
        .lp-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 400px;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 4px 20px rgba(0,0,0,0.4);
          animation: lp-up 0.55s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes lp-up {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        /* ── Card top accent line ────────────────────────────────────── */
        .lp-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg,
            transparent 0%,
            var(--accent) 35%,
            var(--accent-h) 60%,
            transparent 100%);
        }

        /* ── Card header ─────────────────────────────────────────────── */
        .lp-head {
          padding: 32px 32px 24px;
          border-bottom: 1px solid var(--border);
          display: flex; flex-direction: column; align-items: center;
          gap: 14px; text-align: center;
          animation: lp-fd 0.6s ease 0.12s both;
        }
        @keyframes lp-fd { from { opacity:0; } to { opacity:1; } }

        /* ── Icon badge ──────────────────────────────────────────────── */
        .lp-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: var(--accent-s);
          border: 1px solid rgba(var(--accent-rgb), 0.2);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent);
        }

        .lp-title {
          font-family: var(--font-d);
          font-size: 1.5rem; font-weight: 800;
          letter-spacing: -0.025em; color: var(--text);
          margin: 0;
        }
        .lp-sub {
          font-size: 13px; color: var(--text-2);
          line-height: 1.6; margin: 0;
        }

        /* ── Form body ───────────────────────────────────────────────── */
        .lp-body {
          padding: 28px 32px 24px;
          display: flex; flex-direction: column; gap: 18px;
          animation: lp-fd 0.6s ease 0.22s both;
        }

        /* ── Field ───────────────────────────────────────────────────── */
        .lp-field { display: flex; flex-direction: column; gap: 7px; }
        .lp-label {
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--text-2);
        }
        .lp-input-wrap { position: relative; }
        .lp-input-ico {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%);
          color: var(--text-3); pointer-events: none;
          transition: color var(--ease);
        }
        .lp-input-wrap.focused .lp-input-ico { color: var(--accent); }
        .lp-input {
          width: 100%; height: 44px;
          padding: 0 14px 0 40px;
          border-radius: var(--radius);
          border: 1.5px solid var(--border);
          background: var(--panel-2);
          color: var(--text);
          font-family: var(--font-b); font-size: 14px;
          outline: none;
          transition: border-color var(--ease), box-shadow var(--ease), background var(--ease);
          -webkit-appearance: none;
        }
        .lp-input::placeholder { color: var(--text-3); }
        .lp-input:focus {
          border-color: rgba(var(--accent-rgb), 0.55);
          box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.10);
          background: rgba(255,255,255,0.03);
        }

        /* ── Submit button ───────────────────────────────────────────── */
        .lp-btn {
          width: 100%; height: 46px; border-radius: var(--radius);
          border: none; cursor: pointer;
          background: var(--accent);
          color: #0a0a0f;
          font-family: var(--font-b); font-size: 14px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          letter-spacing: 0.01em;
          transition: background var(--ease), transform var(--ease),
                      box-shadow var(--ease), opacity var(--ease);
          margin-top: 4px;
        }
        .lp-btn:hover:not(:disabled) {
          background: var(--accent-h);
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(var(--accent-rgb), 0.35);
        }
        .lp-btn:active:not(:disabled) { transform: translateY(0); }
        .lp-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        @keyframes lp-spin {
          to { transform: rotate(360deg); }
        }
        .lp-spin { animation: lp-spin 0.8s linear infinite; }

        /* ── Footer note ─────────────────────────────────────────────── */
        .lp-foot {
          padding: 16px 32px 24px;
          border-top: 1px solid var(--border);
          text-align: center;
          animation: lp-fd 0.6s ease 0.32s both;
        }
        .lp-foot p {
          font-size: 11.5px; color: var(--text-3);
          line-height: 1.65; margin: 0;
        }
        .lp-foot strong { color: var(--text-2); font-weight: 600; }

        /* ── Responsive ──────────────────────────────────────────────── */
        @media (max-width: 480px) {
          .lp { padding: 16px; }
          .lp-head { padding: 26px 24px 20px; }
          .lp-body { padding: 22px 24px 20px; }
          .lp-foot { padding: 14px 24px 20px; }
        }
      ` }} />

      <div className="lp">
        {/* bg decorations */}
        <div className="lp-grid" />
        <div className="lp-orb" />

        {/* Card */}
        <div className="lp-card">

          {/* Header */}
          <div className="lp-head">
            <div className="lp-icon">
              <ShieldCheck size={22} />
            </div>
            <h1 className="lp-title">Admin Portal</h1>
            <p className="lp-sub">
              Enter your credentials to access the secure CMS dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="lp-body">

              {/* Email */}
              <div className="lp-field">
                <label htmlFor="lp-email" className="lp-label">Email</label>
                <div className={`lp-input-wrap${focused === "email" ? " focused" : ""}`}>
                  <Mail size={15} className="lp-input-ico" />
                  <input
                    id="lp-email"
                    type="email"
                    className="lp-input"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="lp-field">
                <label htmlFor="lp-pass" className="lp-label">Password</label>
                <div className={`lp-input-wrap${focused === "password" ? " focused" : ""}`}>
                  <Lock size={15} className="lp-input-ico" />
                  <input
                    id="lp-pass"
                    type="password"
                    className="lp-input"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="lp-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} className="lp-spin" />
                    Authenticating…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

            </div>
          </form>

          {/* Footer note */}
          <div className="lp-foot">
            <p>
              <strong>Restricted access.</strong> Public registration is
              disabled for security. Only system administrators may issue
              credentials.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}