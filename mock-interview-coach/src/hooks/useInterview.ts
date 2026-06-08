import { useCallback, useRef, useState } from "react";
import { evaluateAnswer, generateSummary } from "../services/groq.service";
import { saveSession } from "../utils/storage";
import type { Feedback, Session } from "../types/interview.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type InterviewStatus =
  | "idle"       // hook initialized, no interview started
  | "loading"    // waiting for Groq API
  | "answering"  // user is composing/speaking their answer
  | "evaluating" // answer submitted, Groq evaluating
  | "feedback"   // feedback received, waiting for user to continue
  | "done";      // all questions answered, session saved

export interface UseInterviewOptions {
  questions: string[];       // pre-loaded question strings
  role: string;              // job role (for Groq prompt context)
  difficulty: string;        // "beginner" | "intermediate" | "advanced"
  type: string;              // "technical" | "behavioral" | "mixed"
  sessionId?: string;        // optional override; defaults to crypto.randomUUID()
}

export interface UseInterviewReturn {
  // ── State ──────────────────────────────────────────────────────────────────
  status: InterviewStatus;
  currentIndex: number;
  answers: string[];
  feedbacks: Feedback[];
  scores: number[];
  isLoading: boolean;
  error: string | null;
  currentFeedback: Feedback | null;

  // ── Derived ────────────────────────────────────────────────────────────────
  totalQuestions: number;
  averageScore: number;
  isLastQuestion: boolean;
  progressPercent: number;

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Submit the user's answer for the current question.
   * Calls Groq → stores feedback + score → moves status to "feedback".
   */
  submitAnswer: (answer: string) => Promise<void>;

  /**
   * Advance to the next question (or call endInterview if on the last one).
   * Resets transient state (current answer, current feedback).
   */
  nextQuestion: () => void;

  /**
   * Skip the current question without evaluating.
   * Records an empty answer + null feedback, then advances.
   */
  skipQuestion: () => void;

  /**
   * Finalize the session: generate a summary, save to localStorage, and
   * set status to "done". Returns the saved session for the caller to
   * navigate to /results or display inline.
   */
  endInterview: () => Promise<Session | null>;

  /** Manually clear any error state. */
  clearError: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useInterview({
  questions,
  role,
  difficulty,
  type,
  sessionId: overrideSessionId,
}: UseInterviewOptions): UseInterviewReturn {

  // ── Core session state ─────────────────────────────────────────────────────
  const [status, setStatus] = useState<InterviewStatus>("answering");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stable session ID for the entire interview lifecycle
  const sessionIdRef = useRef<string>(
    overrideSessionId ?? crypto.randomUUID()
  );

  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const progressPercent =
    totalQuestions > 0 ? Math.round((currentIndex / totalQuestions) * 100) : 0;
  const averageScore =
    scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0;

  // ── submitAnswer ───────────────────────────────────────────────────────────
  const submitAnswer = useCallback(
    async (answer: string) => {
      if (status !== "answering") return;

      const trimmed = answer.trim();

      // Persist the raw answer immediately (even if empty)
      setAnswers((prev) => {
        const updated = [...prev];
        updated[currentIndex] = trimmed;
        return updated;
      });

      if (!trimmed) {
        // Treat as a skip if nothing was typed/spoken
        setFeedbacks((prev) => {
          const updated = [...prev];
          updated[currentIndex] = null as unknown as Feedback;
          return updated;
        });
        setScores((prev) => {
          const updated = [...prev];
          updated[currentIndex] = 0;
          return updated;
        });
        setCurrentFeedback(null);
        setStatus("feedback");
        return;
      }

      setStatus("evaluating");
      setIsLoading(true);
      setError(null);

      const result = await evaluateAnswer(
        questions[currentIndex],
        trimmed,
        role
      );

      setIsLoading(false);

      if (result.error || !result.data) {
        setError(result.error ?? "Failed to evaluate your answer. Please try again.");
        setStatus("answering"); // let user retry
        return;
      }

      const fb = result.data;

      setFeedbacks((prev) => {
        const updated = [...prev];
        updated[currentIndex] = fb;
        return updated;
      });

      setScores((prev) => {
        const updated = [...prev];
        updated[currentIndex] = fb.score;
        return updated;
      });

      setCurrentFeedback(fb);
      setStatus("feedback");
    },
    [currentIndex, questions, role, status]
  );

  // ── nextQuestion ───────────────────────────────────────────────────────────
  const nextQuestion = useCallback(() => {
    if (isLastQuestion) {
      // Caller should invoke endInterview() separately — this just resets state
      setStatus("done");
      return;
    }

    setCurrentIndex((i) => i + 1);
    setCurrentFeedback(null);
    setError(null);
    setStatus("answering");
  }, [isLastQuestion]);

  // ── skipQuestion ───────────────────────────────────────────────────────────
  const skipQuestion = useCallback(() => {
    // Record empty answer + no feedback for this slot
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = "";
      return updated;
    });
    setFeedbacks((prev) => {
      const updated = [...prev];
      updated[currentIndex] = null as unknown as Feedback;
      return updated;
    });
    setScores((prev) => {
      const updated = [...prev];
      updated[currentIndex] = 0;
      return updated;
    });
    setCurrentFeedback(null);
    setError(null);

    if (isLastQuestion) {
      setStatus("done");
    } else {
      setCurrentIndex((i) => i + 1);
      setStatus("answering");
    }
  }, [currentIndex, isLastQuestion]);

  // ── endInterview ───────────────────────────────────────────────────────────
  const endInterview = useCallback(async (): Promise<Session | null> => {
    setIsLoading(true);
    setError(null);

    // Filter out nulls (skipped questions) before summarising
    const validFeedbacks = feedbacks.filter(Boolean);

    let summary: { strengths: string; weaknesses: string } = {
      strengths: "",
      weaknesses: "",
    };

    if (validFeedbacks.length > 0) {
      const result = await generateSummary(validFeedbacks);
      if (result.data) {
        summary = result.data;
      } else {
        // Non-fatal: log but continue saving the session
        console.warn("[useInterview] Summary generation failed:", result.error);
      }
    }

    setIsLoading(false);

    const session: Session = {
      id: sessionIdRef.current,
      date: new Date().toISOString(),
      role,
      difficulty,
      type,
      questions,
      answers,
      feedbacks: validFeedbacks,
      scores,
      averageScore,
      summary,
    };

    try {
      saveSession(session);
    } catch (err) {
      console.error("[useInterview] Failed to persist session:", err);
    }

    setStatus("done");
    return session;
  }, [answers, averageScore, difficulty, feedbacks, questions, role, scores, type]);

  // ── clearError ─────────────────────────────────────────────────────────────
  const clearError = useCallback(() => setError(null), []);

  // ── Return ─────────────────────────────────────────────────────────────────
  return {
    // State
    status,
    currentIndex,
    answers,
    feedbacks,
    scores,
    isLoading,
    error,
    currentFeedback,

    // Derived
    totalQuestions,
    averageScore,
    isLastQuestion,
    progressPercent,

    // Actions
    submitAnswer,
    nextQuestion,
    skipQuestion,
    endInterview,
    clearError,
  };
}