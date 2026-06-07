import { useEffect, useState } from "react";

type Category = "Technical" | "Behavioral";

interface QuestionCardProps {
  question: string;
  category: Category;
  questionKey?: string | number;
}

// ─── Sample Questions ────────────────────────────────────────────────────────
export const sampleQuestions: { question: string; category: Category }[] = [
  // Technical
  {
    category: "Technical",
    question: "Explain the difference between a stack and a queue. When would you choose one over the other?",
  },
  {
    category: "Technical",
    question: "How does the JavaScript event loop work, and what is the difference between microtasks and macrotasks?",
  },
  {
    category: "Technical",
    question: "What is the time complexity of a binary search, and how would you implement it recursively?",
  },

  {
    category: "Technical",
    question: "What is the difference between SQL and NoSQL databases? When would you choose one over the other?",
  },
  {
    category: "Technical",
    question: "Explain how React's virtual DOM works and why it improves performance over direct DOM manipulation.",
  },
  // Behavioral
  {
    category: "Behavioral",
    question: "Tell me about a time you had to deliver a project under a tight deadline. How did you prioritize your work?",
  },
  {
    category: "Behavioral",
    question: "Describe a situation where you disagreed with a teammate's approach. How did you handle the conflict?",
  },
  {
    category: "Behavioral",
    question: "Give an example of when you had to learn a new technology quickly to meet a project requirement.",
  },

  {
    category: "Behavioral",
    question: "Tell me about a time you received critical feedback. How did you respond and what did you change?",
  },
  {
    category: "Behavioral",
    question: "Describe a project you led from start to finish. What was your approach to keeping the team aligned?",
  },
];
// ────────────────────────────────────────────────────────────────────────────

const TechnicalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3.5 4.5L1.5 6.5L3.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.5 4.5L11.5 6.5L9.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 2.5L5.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BehavioralIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="6.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 11c0-2.21 2.015-4 4.5-4S11 8.79 11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const categoryConfig: Record<Category, { label: string; color: string; bg: string; dot: string; icon: React.ReactNode }> = {
  Technical: {
    label: "Technical",
    color: "#2563eb",
    bg: "#eff6ff",
    dot: "#3b82f6",
    icon: <TechnicalIcon />,
  },
  Behavioral: {
    label: "Behavioral",
    color: "#7c3aed",
    bg: "#f5f3ff",
    dot: "#8b5cf6",
    icon: <BehavioralIcon />,
  },
};

export default function QuestionCard({
  question,
  category,
  questionKey,
}: QuestionCardProps) {
  const [visible, setVisible] = useState(false);

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
          {cfg.icon}
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

// ─── Demo: cycles through all sample questions ───────────────────────────────
export function QuestionCardDemo() {
  const [index, setIndex] = useState(0);
  const current = sampleQuestions[index];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: 32, background: "#f9fafb", minHeight: "100vh" }}>
      <QuestionCard
        question={current.question}
        category={current.category}
        questionKey={index}
      />
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => setIndex((i) => (i - 1 + sampleQuestions.length) % sampleQuestions.length)}
          style={{ padding: "8px 20px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 13 }}
        >
          ← Prev
        </button>
        <button
          onClick={() => setIndex((i) => (i + 1) % sampleQuestions.length)}
          style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 13 }}
        >
          Next →
        </button>
      </div>
      <p style={{ fontSize: 12, color: "#9ca3af", fontFamily: "DM Sans, sans-serif" }}>
        {index + 1} / {sampleQuestions.length}
      </p>
    </div>
  );
}