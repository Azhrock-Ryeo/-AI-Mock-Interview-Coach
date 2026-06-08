import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  InterviewContextType,
  InterviewSetup,
  Feedback,
} from '../../types/interview.types'

const InterviewContext = createContext<InterviewContextType | null>(null)

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [setup, setSetup] = useState<InterviewSetup | null>(null)
  const [questions, setQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [scores, setScores] = useState<number[]>([])

  const resetInterview = () => {
    setSetup(null)
    setQuestions([])
    setAnswers([])
    setFeedbacks([])
    setScores([])
  }

  return (
    <InterviewContext.Provider
      value={{
        setup,
        setSetup,
        questions,
        setQuestions,
        answers,
        setAnswers,
        feedbacks,
        setFeedbacks,
        scores,
        setScores,
        resetInterview,
      }}
    >
      {children}
    </InterviewContext.Provider>
  )
}

export function useInterviewContext() {
  const ctx = useContext(InterviewContext)
  if (!ctx) throw new Error('useInterviewContext must be used inside InterviewProvider')
  return ctx
}