import { useCallback, useRef, useState } from "react";
import { evaluateAnswer, generateSummary } from "../services/groq.service";
import { saveSession } from "../utils/storage";
import { getGrade } from "../utils/scoring";
import type { Difficulty, Feedback, InterviewType, Session } from "../types/interview.types";
 //fixed some
 
// ─── Types ────────────────────────────────────────────────────────────────────

export type InterviewStatus =
  | "idle"
  | "loading"
  | "answering"
  | "evaluating"
  | "feedback"
  | "done";

export interface UseInterviewOptions {
  questions: string[];
  role: string;
  difficulty: string;
  type: string;
  userName?: string;
  sessionId?: string;
}

export interface UseInterviewReturn {
  status: InterviewStatus;
  currentIndex: number;
  answers: string[];
  feedbacks: (Feedback | null)[];
  scores: number[];
  isLoading: boolean;
  error: string | null;
  currentFeedback: Feedback | null;
  totalQuestions: number;
  averageScore: number;
  isLastQuestion: boolean;
  progressPercent: number;
  submitAnswer: (answer: string) => Promise<void>;
  nextQuestion: () => void;
  skipQuestion: () => void;
  endInterview: () => Promise<Session | null>;
  clearError: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useInterview({
  questions,
  role,
  difficulty,
  type,
  userName = "User",
  sessionId: overrideSessionId,
}: UseInterviewOptions): UseInterviewReturn {

  const [status, setStatus] = useState<InterviewStatus>("answering");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<(Feedback | null)[]>([]);  // ✅ allows null
  const [scores, setScores] = useState<number[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionIdRef = useRef<string>(overrideSessionId ?? crypto.randomUUID());

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

      setAnswers((prev) => {
        const updated = [...prev];
        updated[currentIndex] = trimmed;
        return updated;
      });

      if (!trimmed) {
        setFeedbacks((prev) => {
          const updated = [...prev];
          updated[currentIndex] = null;  // ✅ null instead of cast
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

      const result = await evaluateAnswer(questions[currentIndex], trimmed, role);

      setIsLoading(false);

      if (result.error || !result.data) {
        setError(result.error ?? "Failed to evaluate your answer. Please try again.");
        setStatus("answering");
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
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = "";
      return updated;
    });
    setFeedbacks((prev) => {
      const updated = [...prev];
      updated[currentIndex] = null;  // ✅ null instead of cast
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

    const validFeedbacks = feedbacks.filter((f): f is Feedback => f !== null);

    if (validFeedbacks.length > 0) {
      const result = await generateSummary(validFeedbacks);
      if (!result.data) {
        console.warn("[useInterview] Summary generation failed:", result.error);
      }
    }

    setIsLoading(false);

    // ✅ Correctly shaped Session object matching interview.types.ts
    const session: Session = {
      id: sessionIdRef.current,
      date: new Date().toISOString(),
      setup: {
        userName,
        jobRole: role,
        difficulty: difficulty as Difficulty,
        interviewType: type as InterviewType,
        questionCount: questions.length,
      },
      questions,
      answers,
      feedbacks: validFeedbacks,
      scores,
      overallScore: averageScore,
      grade: getGrade(averageScore),
    };

    try {
      saveSession(session);
    } catch (err) {
      console.error("[useInterview] Failed to persist session:", err);
    }

    setStatus("done");
    return session;
  }, [answers, averageScore, difficulty, feedbacks, questions, role, scores, type, userName]);

  // ── clearError ─────────────────────────────────────────────────────────────
  const clearError = useCallback(() => setError(null), []);

  return {
    status,
    currentIndex,
    answers,
    feedbacks,
    scores,
    isLoading,
    error,
    currentFeedback,
    totalQuestions,
    averageScore,
    isLastQuestion,
    progressPercent,
    submitAnswer,
    nextQuestion,
    skipQuestion,
    endInterview,
    clearError,
  };
}