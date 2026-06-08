import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Feedback } from "../types/interview.types";

export interface InterviewSetup {
  userName: string;
  jobRole: string;
  difficulty: string;
  interviewType: string;
  questionCount: number;
}

interface InterviewContextType {
  setup: InterviewSetup | null;
  setSetup: (setup: InterviewSetup) => void;
  questions: string[];
  setQuestions: (q: string[]) => void;
  answers: string[];
  setAnswers: (a: string[]) => void;
  feedbacks: Feedback[];
  setFeedbacks: (f: Feedback[]) => void;
  scores: number[];
  setScores: (s: number[]) => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider = ({ children }: { children: ReactNode }) => {
  const [setup, setSetup] = useState<InterviewSetup | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [scores, setScores] = useState<number[]>([]);

  return (
    <InterviewContext.Provider value={{ setup, setSetup, questions, setQuestions, answers, setAnswers, feedbacks, setFeedbacks, scores, setScores }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterviewContext = () => {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error("useInterviewContext must be used within InterviewProvider");
  return ctx;
};