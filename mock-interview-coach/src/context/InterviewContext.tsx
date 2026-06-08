import { useInterviewContext } from "../app/providers/InterviewProvider"
import type { InterviewSetup } from "../types/interview.types"

export type InterviewConfig = {
  name: string
  jobRole: string
  difficulty: string
  interviewType: string
  numQuestions: string
}

export function useInterview() {
  const ctx = useInterviewContext()

  return {
    ...ctx,
    setConfig: (config: InterviewConfig) => {
      ctx.setSetup({
        userName: config.name.trim(),
        jobRole: config.jobRole,
        difficulty: config.difficulty as InterviewSetup["difficulty"],
        interviewType: config.interviewType as InterviewSetup["interviewType"],
        questionCount: Number(config.numQuestions),
      })
    },
  }
}
