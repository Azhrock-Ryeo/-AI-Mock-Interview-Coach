import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface InterviewConfig {
  name: string;
  jobRole: string;
  difficulty: string;
  interviewType: string;
  numQuestions: string;
}

interface InterviewContextType {
  config: InterviewConfig | null;
  setConfig: (config: InterviewConfig) => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfigState] = useState<InterviewConfig | null>(null);

  const setConfig = (cfg: InterviewConfig) => {
    setConfigState(cfg);
    // Increment past sessions in localStorage
    const prev = parseInt(localStorage.getItem("intervue_sessions") || "0", 10);
    localStorage.setItem("intervue_sessions", String(prev + 1));
  };

  return (
    <InterviewContext.Provider value={{ config, setConfig }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error("useInterview must be used within InterviewProvider");
  return ctx;
};