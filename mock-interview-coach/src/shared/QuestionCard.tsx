import { useEffect, useState } from "react";

type Category = "Technical" | "Behavioral";

interface QuestionCardProps {
  question: string;
  category: Category;
  questionKey?: string | number; // change this to trigger re-animation
}
 
const categoryConfig: Record<Category, { label: string; color: string; bg: string; dot: string }> = {
  Technical: {
    label: "Technical",
    color: "#2563eb",
    bg: "#eff6ff",
    dot: "#3b82f6",
  },
  Behavioral: {
    label: "Behavioral",
    color: "#7c3aed",
    bg: "#f5f3ff",
    dot: "#8b5cf6",
  },
};
 
export default function QuestionCard({
  question,
  category,
  questionKey,
}: QuestionCardProps) {
  const [visible, setVisible] = useState(false);
 
  // Re-trigger fade-in whenever the question changes
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, [question, questionKey]);
 
  const cfg = categoryConfig[category];
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');
 
        .qc-card {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          border: 1.5px solid #e5e7eb;
          border-radius: 20px;
          padding: 36px 40px;
          max-width: 680px;
          width: 100%;
          box-shadow:
            0 1px 3px rgba(0,0,0,0.04),
            0 8px 32px rgba(0,0,0,0.06);
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.42s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);
        }
 
        .qc-card.qc-visible {
          opacity: 1;
          transform: translateY(0);
        }
 
        /* Subtle top accent line */
        .qc-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
          border-radius: 20px 20px 0 0;
        }
 
        .qc-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
 
        .qc-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
 
        .qc-question {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.2rem, 2.5vw, 1.6rem);
          line-height: 1.5;
          color: #111827;
          margin: 0;
          letter-spacing: -0.01em;
        }
 
        .qc-footer {
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          gap: 8px;
        }
 
        .qc-footer-icon {
          width: 16px;
          height: 16px;
          opacity: 0.35;
        }
 
        .qc-footer-text {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
        }
      `}</style>
 
      <div
        className={`qc-card${visible ? " qc-visible" : ""}`}
        style={{
          "--accent-start": cfg.color,
          "--accent-end": category === "Technical" ? "#06b6d4" : "#ec4899",
        } as React.CSSProperties}
        role="article"
        aria-label={`${category} question`}
      >
        {/* Category Badge */}
        <div
          className="qc-badge"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          <span
            className="qc-badge-dot"
            style={{ background: cfg.dot }}
          />
          {cfg.label}
        </div>
 
        {/* Question Text */}
        <p className="qc-question">{question}</p>
 
        {/* Footer */}
        <div className="qc-footer">
          <svg
            className="qc-footer-icon"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="qc-footer-text">Take your time to answer thoughtfully</span>
        </div>
      </div>
    </>
  );
}
 