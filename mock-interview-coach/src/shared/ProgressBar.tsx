import { useEffect, useState } from "react";
 
interface ProgressBarProps {
  current: number;   // e.g. 3
  total: number;     // e.g. 10
  label?: string;    // optional override label, default: "Question"
}
 
export default function ProgressBar({
  current,
  total,
  label = "Question",
}: ProgressBarProps) {
  const [displayedWidth, setDisplayedWidth] = useState(0);
 
  const clamped = Math.min(Math.max(current, 0), total);
  const percent = total > 0 ? (clamped / total) * 100 : 0;
  const isComplete = clamped === total;
 
  // Animate fill whenever percent changes
  useEffect(() => {
    // Tiny delay so the browser paints 0% first, enabling the CSS transition
    const t = setTimeout(() => setDisplayedWidth(percent), 60);
    return () => clearTimeout(t);
  }, [percent]);
 
  return (
    <>
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
        .pb-wrapper {
        font-family: 'DM Sans', sans-serif;
        width: 100%;
        max-width: 680px;
        }

        .pb-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 10px;
        }
 
        .pb-label {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        color: #6b7280;
        }

        .pb-counter {
        display: flex;
        align-items: baseline;
        gap: 2px;
        }

        .pb-current {
          font-size: 22px;
          font-weight: 700;
          color: #111827;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
 
        .pb-separator {
          font-size: 14px;
          font-weight: 500;
          color: #d1d5db;
          margin: 0 2px;
        }
 
        .pb-total {
          font-size: 14px;
          font-weight: 500;
          color: #9ca3af;
          font-variant-numeric: tabular-nums;
        }
 
        .pb-track {
          width: 100%;
          height: 8px;
          background: #f3f4f6;
          border-radius: 999px;
          overflow: hidden;
          position: relative;
        }
 
        .pb-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
          transition: width 0.55s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
 
        /* Shimmer sweep on the fill */
        .pb-fill::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.35) 50%,
            transparent 100%
          );
          animation: pb-shimmer 2s ease-in-out infinite;
          border-radius: inherit;
        }
 
        @keyframes pb-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
 
        /* Complete state: green gradient, no shimmer */
        .pb-fill.pb-complete {
          background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
        }
        .pb-fill.pb-complete::after {
          display: none;
        }
 
        .pb-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }
 
        .pb-pct {
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.03em;
        }
 
        .pb-done-badge {
          font-size: 11px;
          font-weight: 600;
          color: #10b981;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 4px;
          opacity: 0;
          transform: scale(0.85);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
 
        .pb-done-badge.pb-done-visible {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>
 
      <div className="pb-wrapper" role="region" aria-label="Progress">
        {/* Header: label + counter */}
        <div className="pb-header">
          <span className="pb-label">{label}</span>
          <div className="pb-counter" aria-label={`${clamped} of ${total}`}>
            <span className="pb-current">{clamped}</span>
            <span className="pb-separator">/</span>
            <span className="pb-total">{total}</span>
          </div>
        </div>
 
        {/* Track + animated fill */}
        <div
          className="pb-track"
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={total}
        >
          <div
            className={`pb-fill${isComplete ? " pb-complete" : ""}`}
            style={{ width: `${displayedWidth}%` }}
          />
        </div>
 
        {/* Footer: percentage + done badge */}
        <div className="pb-footer">
          <span className="pb-pct">{Math.round(percent)}% complete</span>
          <span className={`pb-done-badge${isComplete ? " pb-done-visible" : ""}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All done!
          </span>
        </div>
      </div>
    </>
  );
}