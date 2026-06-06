export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type InterviewType = 'Technical' | 'Behavioral' | 'Mixed'
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F'

export interface InterviewSetup {
  userName: string
  jobRole: string
  difficulty: Difficulty
  interviewType: InterviewType
  questionCount: number
}

export interface Feedback {
  whatWentWell: string
  whatToImprove: string
  betterAnswer: string
  score: number
}

export interface Session {
  id: string
  date: string
  setup: InterviewSetup
  questions: string[]
  answers: string[]
  feedbacks: Feedback[]
  scores: number[]
  overallScore: number
  grade: Grade
}

export interface InterviewContextType {
  setup: InterviewSetup | null
  setSetup: (setup: InterviewSetup) => void
  questions: string[]
  setQuestions: (questions: string[]) => void
  answers: string[]
  setAnswers: (answers: string[]) => void
  feedbacks: Feedback[]
  setFeedbacks: (feedbacks: Feedback[]) => void
  scores: number[]
  setScores: (scores: number[]) => void
  resetInterview: () => void
}