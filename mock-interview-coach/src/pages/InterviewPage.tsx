import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Component Imports ────────────────────────────────────────────────────────
import QuestionCard from "../components/shared/QuestionCard";
import ProgressBar from "../components/shared/ProgressBar";
import TranscriptBox from "../components/shared/Transcript";
import { QuestionCardSkeleton, FeedbackCardSkeleton } from "../components/ui/Skeleton";

// ─── Service & Type Imports ───────────────────────────────────────────────────
import { generateQuestions, evaluateAnswer } from "../services/groq.service";
import type { Feedback } from "../types/interview.types";

// ─── Hook Imports ─────────────────────────────────────────────────────────────
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

// ─── Config ───────────────────────────────────────────────────────────────────
const TOTAL_QUESTIONS = 10;
const QUESTION_TIMER_SECONDS = 120; // 2 minutes per question

// ─── Types ────────────────────────────────────────────────────────────────────
type Category = "Technical" | "Behavioral";

interface Question {
  text: string;
  category: Category;
}

type PagePhase = "loading" | "answering" | "evaluating" | "feedback" | "done";

// ─── Score Badge ──────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 8) return { bg: "#ecfdf5", text: "#059669", border: "#a7f3d0" };
    if (score >= 5) return { bg: "#fffbeb", text: "#d97706", border: "#fde68a" };
    return { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" };
  };
  const { bg, text, border } = getColor();

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 12px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 700,
        background: bg,
        color: text,
        border: `1.5px solid ${border}`,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {score}/10
    </span>
  );
}

// ─── FeedbackCard ─────────────────────────────────────────────────────────────
function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .fc-card {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          border: 1.5px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);
          animation: fc-slide-in 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes fc-slide-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          cursor: pointer;
          user-select: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .fc-header.open {
          border-bottom-color: #f3f4f6;
        }

        .fc-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .fc-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          font-size: 15px;
          flex-shrink: 0;
        }

        .fc-title {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .fc-chevron {
          width: 20px;
          height: 20px;
          color: #9ca3af;
          transition: transform 0.25s ease;
        }

        .fc-chevron.open {
          transform: rotate(180deg);
        }

        .fc-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease;
        }

        .fc-body.open {
          grid-template-rows: 1fr;
        }

        .fc-body-inner {
          overflow: hidden;
        }

        .fc-sections {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .fc-section {
          border-radius: 10px;
          padding: 12px 14px;
        }

        .fc-section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .fc-section-text {
          font-size: 13.5px;
          line-height: 1.6;
          color: #374151;
        }

        .fc-score-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }

        .fc-score-track {
          flex: 1;
          height: 6px;
          background: #f3f4f6;
          border-radius: 999px;
          overflow: hidden;
        }

        .fc-score-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div className="fc-card">
        {/* Header — click to collapse/expand */}
        <div
          className={`fc-header ${expanded ? "open" : ""}`}
          onClick={() => setExpanded((v) => !v)}
          role="button"
          aria-expanded={expanded}
        >
          <div className="fc-header-left">
            <div className="fc-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 3L6 10.5 3 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="fc-title">Answer Feedback</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ScoreBadge score={feedback.score} />
            <svg className={`fc-chevron ${expanded ? "open" : ""}`} viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Collapsible body */}
        <div className={`fc-body ${expanded ? "open" : ""}`}>
          <div className="fc-body-inner">
            <div className="fc-sections">
              {/* What went well */}
              <div className="fc-section" style={{ background: "#f0fdf4" }}>
                <p className="fc-section-label" style={{ color: "#16a34a" }}>✓ What went well</p>
                <p className="fc-section-text">{feedback.whatWentWell}</p>
              </div>

              {/* What to improve */}
              <div className="fc-section" style={{ background: "#fff7ed" }}>
                <p className="fc-section-label" style={{ color: "#c2410c" }}>↑ What to improve</p>
                <p className="fc-section-text">{feedback.whatToImprove}</p>
              </div>

              {/* Better answer */}
              <div className="fc-section" style={{ background: "#eff6ff" }}>
                <p className="fc-section-label" style={{ color: "#1d4ed8" }}>💡 Stronger answer</p>
                <p className="fc-section-text">{feedback.betterAnswer}</p>
              </div>

              {/* Score bar */}
              <div className="fc-score-row">
                <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, minWidth: 40 }}>Score</span>
                <div className="fc-score-track">
                  <div
                    className="fc-score-fill"
                    style={{
                      width: `${(feedback.score / 10) * 100}%`,
                      background:
                        feedback.score >= 8
                          ? "linear-gradient(90deg, #10b981, #34d399)"
                          : feedback.score >= 5
                          ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                          : "linear-gradient(90deg, #ef4444, #f87171)",
                    }}
                  />
                </div>
                <ScoreBadge score={feedback.score} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Inline Timer (no external hook required for standalone use) ───────────────
function InlineTimer({
  duration,
  onExpire,
  isRunning,
}: {
  duration: number;
  onExpire?: () => void;
  isRunning: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset whenever duration changes (i.e. new question)
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, onExpire]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const display = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const isWarning = timeLeft <= 30 && timeLeft > 10;
  const isCritical = timeLeft <= 10;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 14px",
        borderRadius: 10,
        background: isCritical ? "#fef2f2" : isWarning ? "#fffbeb" : "#f9fafb",
        border: `1.5px solid ${isCritical ? "#fecaca" : isWarning ? "#fde68a" : "#e5e7eb"}`,
        transition: "all 0.3s ease",
      }}
    >
      {/* Clock icon */}
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        style={{ color: isCritical ? "#dc2626" : isWarning ? "#d97706" : "#6b7280" }}
      >
        <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M7.5 4.5V7.5L9.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>

      <span
        style={{
          fontSize: 15,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          fontFamily: "'DM Sans', sans-serif",
          color: isCritical ? "#dc2626" : isWarning ? "#d97706" : "#374151",
          animation: isCritical ? "pulse 1s ease-in-out infinite" : "none",
        }}
      >
        {display}
      </span>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

// ─── MicButton (self-contained with ring animation) ───────────────────────────
function MicButton({
  isListening,
  isSupported,
  onToggle,
}: {
  isListening: boolean;
  isSupported: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <style>{`
        .mic-btn {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .mic-btn.listening {
          background: linear-gradient(135deg, #dc2626 0%, #e11d48 100%);
          box-shadow: 0 4px 20px rgba(220, 38, 38, 0.35);
        }

        .mic-btn:hover:not(:disabled) {
          transform: scale(1.06);
          box-shadow: 0 6px 28px rgba(37, 99, 235, 0.45);
        }

        .mic-btn.listening:hover:not(:disabled) {
          box-shadow: 0 6px 28px rgba(220, 38, 38, 0.45);
        }

        .mic-btn:active:not(:disabled) {
          transform: scale(0.96);
        }

        .mic-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .mic-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(220, 38, 38, 0.35);
          animation: ring-expand 1.5s ease-out infinite;
        }

        .mic-ring:nth-child(2) { animation-delay: 0.4s; }
        .mic-ring:nth-child(3) { animation-delay: 0.8s; }

        @keyframes ring-expand {
          0%   { width: 72px; height: 72px; opacity: 0.7; }
          100% { width: 120px; height: 120px; opacity: 0; }
        }
      `}</style>

      <div style={{ position: "relative", width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isListening && (
          <>
            <span className="mic-ring" />
            <span className="mic-ring" />
            <span className="mic-ring" />
          </>
        )}
        <button
          onClick={onToggle}
          disabled={!isSupported}
          className={`mic-btn${isListening ? " listening" : ""}`}
          aria-label={isListening ? "Stop recording" : "Start recording"}
        >
          <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
            <rect x="15" y="4" width="14" height="22" rx="7" fill="white" fillOpacity="0.95" />
            <path d="M8 21C8 28.732 14.268 35 22 35C29.732 35 36 28.732 36 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <line x1="22" y1="35" x2="22" y2="41" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="41" x2="28" y2="41" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </>
  );
}

// ─── InterviewPage ─────────────────────────────────────────────────────────────
export default function InterviewPage() {
  const navigate = useNavigate();

  // ── Session State ──────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<PagePhase>("loading");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [allFeedbacks, setAllFeedbacks] = useState<Feedback[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [timerKey, setTimerKey] = useState(0); // forces timer reset on new question

  // ── Speech Recognition ─────────────────────────────────────────────────────
  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript: liveTranscript,
    error: speechError,
  } = useSpeechRecognition();

  // Merge live speech into textarea transcript
  useEffect(() => {
    if (liveTranscript) {
      setTranscript((prev) => {
        const separator = prev.trim() ? " " : "";
        return prev + separator + liveTranscript;
      });
    }
  }, [liveTranscript]);

  // ── Load Questions on Mount ────────────────────────────────────────────────
  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadQuestions() {
    setPhase("loading");
    setLoadError(null);

    // Pull config from sessionStorage (set on SetupPage) with sensible defaults
    const role = sessionStorage.getItem("interview_role") || "Software Engineer";
    const difficulty = sessionStorage.getItem("interview_difficulty") || "intermediate";
    const type = sessionStorage.getItem("interview_type") || "mixed";

    const result = await generateQuestions(role, difficulty, type, TOTAL_QUESTIONS);

    if (result.error || !result.data) {
      setLoadError(result.error ?? "Failed to load questions.");
      setPhase("loading"); // stay on loading with error shown
      return;
    }

    // Map raw strings to Question objects; alternate category if type is mixed
    const mapped: Question[] = result.data.map((text, i) => ({
      text,
      category:
        type === "behavioral"
          ? "Behavioral"
          : type === "technical"
          ? "Technical"
          : i % 2 === 0
          ? "Technical"
          : "Behavioral",
    }));

    setQuestions(mapped);
    setCurrentIndex(0);
    setTranscript("");
    setFeedback(null);
    setPhase("answering");
  }

  // ── Submit Answer ──────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!transcript.trim()) return;
    if (isListening) stopListening();

    setPhase("evaluating");

    const role = sessionStorage.getItem("interview_role") || "Software Engineer";
    const current = questions[currentIndex];
    const result = await evaluateAnswer(current.text, transcript, role);

    if (result.error || !result.data) {
      // Surface error but keep transcript so user can retry
      setPhase("answering");
      return;
    }

    const newFeedback = result.data;
    setFeedback(newFeedback);
    setAllFeedbacks((prev) => [...prev, newFeedback]);
    setPhase("feedback");
  }

  // ── Next Question ──────────────────────────────────────────────────────────
  function handleNext() {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= questions.length) {
      // All done → save feedbacks and navigate
      sessionStorage.setItem("interview_feedbacks", JSON.stringify(allFeedbacks));
      navigate("/results");
      return;
    }

    setCurrentIndex(nextIndex);
    setTranscript("");
    setFeedback(null);
    setTimerKey((k) => k + 1); // reset timer
    setPhase("answering");
  }

  // ── Timer expired → auto-submit ────────────────────────────────────────────
  function handleTimerExpire() {
    if (phase === "answering") {
      if (transcript.trim()) {
        handleSubmit();
      } else {
        // Skip if no answer given
        handleNext();
      }
    }
  }

  // ── Skip Question ──────────────────────────────────────────────────────────
  function handleSkip() {
    if (isListening) stopListening();
    handleNext();
  }

  // ── Mic Toggle ─────────────────────────────────────────────────────────────
  function handleMicToggle() {
    if (isListening) stopListening();
    else startListening();
  }

  // ── Current Question ────────────────────────────────────────────────────────
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const canSubmit = transcript.trim().length > 0 && phase === "answering";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ip-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
        }

        /* ── Top bar ── */
        .ip-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 32px;
          background: #ffffff;
          border-bottom: 1.5px solid #f3f4f6;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .ip-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ip-logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2563eb;
          animation: ip-pulse 2s ease-in-out infinite;
        }

        @keyframes ip-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        /* ── Main content ── */
        .ip-main {
          flex: 1;
          max-width: 740px;
          width: 100%;
          margin: 0 auto;
          padding: 40px 24px 80px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* ── Answer section ── */
        .ip-answer-section {
          background: #ffffff;
          border: 1.5px solid #e5e7eb;
          border-radius: 20px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          animation: ip-fade-up 0.35s ease both;
        }

        @keyframes ip-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ip-answer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .ip-answer-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ip-mic-row {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 10px;
        }

        .ip-mic-label {
          font-size: 12.5px;
          font-weight: 500;
          color: #9ca3af;
          transition: color 0.3s;
        }

        .ip-mic-label.listening {
          color: #dc2626;
        }

        /* ── Action buttons ── */
        .ip-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .ip-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 22px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.15s ease;
          font-family: 'DM Sans', sans-serif;
        }

        .ip-btn:active:not(:disabled) {
          transform: scale(0.97);
        }

        .ip-btn-primary {
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.28);
        }

        .ip-btn-primary:hover:not(:disabled) {
          background: #1d4ed8;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.38);
        }

        .ip-btn-primary:disabled {
          background: #bfdbfe;
          cursor: not-allowed;
          box-shadow: none;
        }

        .ip-btn-ghost {
          background: transparent;
          color: #6b7280;
          border: 1.5px solid #e5e7eb;
        }

        .ip-btn-ghost:hover:not(:disabled) {
          background: #f9fafb;
          color: #374151;
          border-color: #d1d5db;
        }

        .ip-btn-success {
          background: #059669;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.28);
        }

        .ip-btn-success:hover {
          background: #047857;
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.38);
        }

        /* ── Loading / Error states ── */
        .ip-loading-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 20px;
        }

        .ip-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: ip-spin 0.8s linear infinite;
        }

        @keyframes ip-spin {
          to { transform: rotate(360deg); }
        }

        .ip-error-box {
          background: #fef2f2;
          border: 1.5px solid #fecaca;
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }

        .ip-error-title {
          font-size: 15px;
          font-weight: 600;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ip-error-text {
          font-size: 13.5px;
          color: #7f1d1d;
          line-height: 1.5;
        }

        /* ── Evaluating overlay ── */
        .ip-evaluating {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding: 32px;
          background: #ffffff;
          border: 1.5px solid #e5e7eb;
          border-radius: 20px;
          text-align: center;
        }

        .ip-evaluating-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .ip-evaluating-sublabel {
          font-size: 12.5px;
          color: #9ca3af;
        }

        /* ── Divider ── */
        .ip-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #d1d5db;
          font-size: 12px;
        }

        .ip-divider::before,
        .ip-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        /* ── Speech error ── */
        .ip-speech-error {
          font-size: 12px;
          color: #dc2626;
          background: #fef2f2;
          border-radius: 8px;
          padding: 6px 12px;
        }
      `}</style>

      <div className="ip-root">
        {/* ── Top Navigation Bar ─────────────────────────────────────────────── */}
        <header className="ip-topbar">
          <div className="ip-logo">
            <div className="ip-logo-dot" />
            MockMate
          </div>

          {/* Progress bar in top bar — only shown when interview is active */}
          {phase !== "loading" && questions.length > 0 && (
            <div style={{ flex: 1, maxWidth: 380, margin: "0 32px" }}>
              <ProgressBar
                current={currentIndex + (phase === "feedback" ? 1 : 0)}
                total={questions.length}
              />
            </div>
          )}

          {/* Timer — shown only while answering */}
          {phase === "answering" && (
            <InlineTimer
              key={timerKey}
              duration={QUESTION_TIMER_SECONDS}
              onExpire={handleTimerExpire}
              isRunning={phase === "answering"}
            />
          )}

          {/* Placeholder to keep layout balanced when no timer */}
          {phase !== "answering" && <div style={{ width: 100 }} />}
        </header>

        {/* ── Main Content ────────────────────────────────────────────────────── */}
        <main className="ip-main">

          {/* ── LOADING PHASE ────────────────────────────────────────────────── */}
          {phase === "loading" && !loadError && (
            <>
              <div className="ip-loading-center">
                <div className="ip-spinner" />
                <p style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>
                  Preparing your interview questions…
                </p>
              </div>
              {/* Show skeleton cards below while loading */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
                <QuestionCardSkeleton />
              </div>
            </>
          )}

          {/* ── LOAD ERROR ───────────────────────────────────────────────────── */}
          {phase === "loading" && loadError && (
            <div className="ip-loading-center">
              <div className="ip-error-box" style={{ maxWidth: 480, width: "100%" }}>
                <p className="ip-error-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M9 5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <circle cx="9" cy="13" r="0.8" fill="currentColor" />
                  </svg>
                  Could not load questions
                </p>
                <p className="ip-error-text">{loadError}</p>
                <button className="ip-btn ip-btn-primary" onClick={loadQuestions}>
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* ── ANSWERING PHASE ──────────────────────────────────────────────── */}
          {(phase === "answering" || phase === "evaluating" || phase === "feedback") &&
            currentQuestion && (
              <>
                {/* Question number label */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      color: "#6b7280",
                    }}
                  >
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                </div>

                {/* Question Card */}
                <QuestionCard
                  question={currentQuestion.text}
                  category={currentQuestion.category}
                  questionKey={currentIndex}
                />

                {/* ── EVALUATING STATE ──────────────────────────────────────── */}
                {phase === "evaluating" && (
                  <div className="ip-evaluating">
                    <div className="ip-spinner" />
                    <p className="ip-evaluating-label">Evaluating your answer…</p>
                    <p className="ip-evaluating-sublabel">
                      Our AI is reviewing your response and preparing detailed feedback.
                    </p>
                    <FeedbackCardSkeleton />
                  </div>
                )}

                {/* ── ANSWER INPUT (shown while answering) ─────────────────── */}
                {phase === "answering" && (
                  <div className="ip-answer-section">
                    <div className="ip-answer-header">
                      <span className="ip-answer-label">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                          <path d="M2 3h9M2 6.5h6M2 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Your answer
                      </span>

                      {speechError && (
                        <span className="ip-speech-error">{speechError}</span>
                      )}
                    </div>

                    {/* Mic Button centred */}
                    <div className="ip-mic-row">
                      <MicButton
                        isListening={isListening}
                        isSupported={isSupported}
                        onToggle={handleMicToggle}
                      />
                      <p className={`ip-mic-label${isListening ? " listening" : ""}`}>
                        {!isSupported
                          ? "Speech not supported in this browser"
                          : isListening
                          ? "Listening — click to stop"
                          : "Click mic to speak your answer"}
                      </p>
                    </div>

                    <div className="ip-divider">or type below</div>

                    {/* Transcript / text area */}
                    <TranscriptBox transcript={transcript} onChange={setTranscript} />

                    {/* Action buttons */}
                    <div className="ip-actions">
                      <button
                        className="ip-btn ip-btn-primary"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        style={{ flex: 1 }}
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                          <path d="M7.5 2L13 7.5 7.5 13M2 7.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Submit Answer
                      </button>

                      <button
                        className="ip-btn ip-btn-ghost"
                        onClick={handleSkip}
                        title="Skip this question"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                )}

                {/* ── FEEDBACK STATE ────────────────────────────────────────── */}
                {phase === "feedback" && feedback && (
                  <>
                    <FeedbackCard feedback={feedback} />

                    <div className="ip-actions">
                      <button
                        className={`ip-btn ${isLastQuestion ? "ip-btn-success" : "ip-btn-primary"}`}
                        onClick={handleNext}
                        style={{ flex: 1 }}
                      >
                        {isLastQuestion ? (
                          <>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                              <path d="M2 7.5l4 4 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            See Results
                          </>
                        ) : (
                          <>
                            Next Question
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                              <path d="M5 2.5L10 7.5 5 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
        </main>
      </div>
    </>
  );
}