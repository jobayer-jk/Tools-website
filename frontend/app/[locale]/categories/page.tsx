import Link from "next/link";
import { toolCategories } from "@/lib/tools-registry";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Tools & Categories",
  description: "Browse our entire library of carefully crafted developer utilities, image converters, PDF tools, and AI generators.",
};

export default function AllCategoriesPage() {
  const totalTools = toolCategories.reduce((acc, c) => acc + c.tools.length, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

        /* --- tokens --- */
        .cp {
          --em:      #059669;
          --em-rgb:  5,150,105;
          --em-s:    rgba(5,150,105,0.08);
          --em-h:    #10b981;
          --warm:    #d97706;
          --surface: var(--card, #fff);
          --surf-2:  var(--muted, #f0ede6);
          --bdr:     var(--border, rgba(0,0,0,0.09));
          --text:    var(--foreground, #1a1a14);
          --text-2:  var(--muted-foreground, rgba(26,26,20,.52));
          --text-3:  rgba(26,26,20,.28);
          --sh:      0 1px 4px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
          --sh-lg:   0 12px 40px rgba(0,0,0,.10);
          --r:       12px;
          --font-d:  'Syne', sans-serif;
          --font-b:  'Manrope', sans-serif;
          --ease:    0.22s cubic-bezier(0.4,0,0.2,1);

          font-family: var(--font-b);
          color: var(--text);
          padding: 52px 24px 72px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .dark .cp {
          --em:      #10b981;
          --em-rgb:  16,185,129;
          --em-s:    rgba(16,185,129,0.10);
          --em-h:    #34d399;
          --warm:    #f59e0b;
          --text-3:  rgba(210,208,192,.24);
          --sh-lg:   0 12px 40px rgba(0,0,0,.55);
        }

        /* --- page head --- */
        .cp-head {
          text-align: center;
          max-width: 580px;
          margin: 0 auto 48px;
          display: flex; flex-direction: column; align-items: center; gap: 14px;
        }
        .cp-kicker {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 14px; border-radius: 9999px;
          border: 1px solid var(--bdr);
          background: var(--surface);
          box-shadow: var(--sh);
          font-size: 12px; font-weight: 600; color: var(--text-2);
        }
        .cp-kicker-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--em); flex-shrink: 0;
          box-shadow: 0 0 6px rgba(var(--em-rgb),.8);
          animation: cp-blink 2.4s ease-in-out infinite;
        }
        @keyframes cp-blink {
          0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.8)}
        }
        .cp-title {
          font-family: var(--font-d);
          font-size: clamp(1.9rem, 4vw, 2.8rem);
          font-weight: 900; letter-spacing: -0.035em;
          color: var(--text); margin: 0; line-height: 1.08;
        }
        .cp-title-em { color: var(--em); }
        .cp-sub {
          font-size: 15px; color: var(--text-2);
          line-height: 1.7; margin: 0; max-width: 460px;
        }

        /* --- stats row --- */
        .cp-stats {
          display: flex; align-items: center; gap: 6px;
          flex-wrap: wrap; justify-content: center;
        }
        .cp-stat-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 13px; border-radius: 9999px;
          border: 1px solid var(--bdr);
          background: var(--surface);
          box-shadow: var(--sh);
          font-size: 12.5px; font-weight: 600; color: var(--text-2);
        }
        .cp-stat-pill-val {
          font-family: var(--font-d); font-size: 13px;
          font-weight: 800; color: var(--em);
        }
        .cp-stat-sep {
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--bdr); flex-shrink: 0;
        }

        /* --- grid --- */
        .cp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
        }

        /* --- category card --- */
        .cp-card {
          position: relative; overflow: hidden;
          display: flex; flex-direction: column;
          padding: 20px; border-radius: var(--r);
          border: 1px solid var(--bdr);
          background: var(--surface);
          box-shadow: var(--sh);
          text-decoration: none;
          transition: border-color var(--ease), box-shadow var(--ease),
                      transform var(--ease);
        }
        .cp-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(145deg, var(--em-s) 0%, transparent 55%);
          opacity: 0; transition: opacity var(--ease); pointer-events: none;
        }
        .cp-card:hover {
          border-color: rgba(var(--em-rgb), 0.30);
          box-shadow: var(--sh-lg);
          transform: translateY(-4px);
        }
        .cp-card:hover::before { opacity: 1; }

        /* card icon */
        .cp-card-ico {
          width: 40px; height: 40px; border-radius: 11px;
          background: var(--em-s); color: var(--em);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 14px; flex-shrink: 0;
          transition: background var(--ease), color var(--ease), transform var(--ease);
        }
        .cp-card:hover .cp-card-ico {
          background: var(--em); color: #fff;
          transform: rotate(-6deg) scale(1.08);
        }

        /* card name */
        .cp-card-name {
          font-family: var(--font-d);
          font-size: 15px; font-weight: 700;
          color: var(--text); margin: 0 0 6px;
          letter-spacing: -0.015em;
          transition: color var(--ease);
        }
        .cp-card:hover .cp-card-name { color: var(--em); }

        /* card description */
        .cp-card-desc {
          font-size: 12.5px; color: var(--text-2);
          line-height: 1.55; flex: 1;
          overflow: hidden; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }

        /* card footer */
        .cp-card-foot {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 16px; padding-top: 14px;
          border-top: 1px solid var(--bdr);
        }
        .cp-card-count {
          font-size: 12px; font-weight: 700;
          color: var(--text-3);
          transition: color var(--ease);
        }
        .cp-card:hover .cp-card-count { color: var(--em); }
        .cp-card-arr {
          width: 24px; height: 24px; border-radius: 50%;
          border: 1px solid var(--bdr);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-3);
          transition: background var(--ease), color var(--ease),
                      border-color var(--ease), transform var(--ease);
        }
        .cp-card:hover .cp-card-arr {
          background: var(--em-s); color: var(--em);
          border-color: rgba(var(--em-rgb), 0.30);
          transform: rotate(-45deg);
        }

        /* --- stagger animation on mount --- */
        @keyframes cp-rise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cp-grid > *:nth-child(1)  { animation: cp-rise .45s ease .02s both }
        .cp-grid > *:nth-child(2)  { animation: cp-rise .45s ease .05s both }
        .cp-grid > *:nth-child(3)  { animation: cp-rise .45s ease .08s both }
        .cp-grid > *:nth-child(4)  { animation: cp-rise .45s ease .11s both }
        .cp-grid > *:nth-child(5)  { animation: cp-rise .45s ease .14s both }
        .cp-grid > *:nth-child(6)  { animation: cp-rise .45s ease .17s both }
        .cp-grid > *:nth-child(7)  { animation: cp-rise .45s ease .20s both }
        .cp-grid > *:nth-child(8)  { animation: cp-rise .45s ease .23s both }
        .cp-grid > *:nth-child(9)  { animation: cp-rise .45s ease .26s both }
        .cp-grid > *:nth-child(10) { animation: cp-rise .45s ease .29s both }
        .cp-grid > *:nth-child(11) { animation: cp-rise .45s ease .32s both }
        .cp-grid > *:nth-child(12) { animation: cp-rise .45s ease .35s both }
        .cp-grid > *:nth-child(n+13) { animation: cp-rise .45s ease .38s both }

        /* --- responsive --- */
        @media(max-width:768px) {
          .cp { padding: 40px 16px 56px; }
          .cp-head { margin-bottom: 36px; }
          .cp-grid { grid-template-columns: repeat(auto-fill, minmax(160px,1fr)); gap: 10px; }
        }
        @media(max-width:520px) {
          .cp-grid { grid-template-columns: 1fr 1fr; gap: 9px; }
          .cp-title { font-size: 1.8rem; }
        }
        @media(max-width:360px) {
          .cp-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="cp">

        {/* Page header */}
        <div className="cp-head">
          <h1 className="cp-title">
            All <span className="cp-title-em">Tools</span> &amp; Categories
          </h1>

          <p className="cp-sub">
            Every utility, converter, and generator we offer - organized into
            dedicated sections for fast browsing.
          </p>

          <div className="cp-stats">
            <div className="cp-stat-pill">
              <span className="cp-stat-pill-val">{toolCategories.length}</span>
              categories
            </div>
            <div className="cp-stat-sep" />
            <div className="cp-stat-pill">
              <span className="cp-stat-pill-val">{totalTools}+</span>
              free tools
            </div>
            <div className="cp-stat-sep" />
            <div className="cp-stat-pill">
              No sign-up needed
            </div>
          </div>
        </div>

        {/* Category grid */}
        <div className="cp-grid">
          {toolCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="cp-card"
              >
                <div className="cp-card-ico">
                  <Icon size={19} />
                </div>
                <h2 className="cp-card-name">{category.name}</h2>
                <p className="cp-card-desc">{category.description}</p>
                <div className="cp-card-foot">
                  <span className="cp-card-count">
                    {category.tools.length} tool{category.tools.length !== 1 ? "s" : ""}
                  </span>
                  <div className="cp-card-arr">
                    <ChevronRight size={13} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </>
  );
}