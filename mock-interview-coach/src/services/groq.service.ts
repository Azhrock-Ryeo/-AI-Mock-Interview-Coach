import { GROQ_API_KEY } from '../config/env'
import type { Feedback, SessionSummary } from '../types/interview.types'
import { questionPrompt, feedbackPrompt, summaryPrompt } from '../utils/prompts'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GroqServiceResult<T> {
  data: T | null
  error: string | null
  isLoading: boolean
}

// ─── Core API Caller ──────────────────────────────────────────────────────────

async function callGroq(prompt: string): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Groq API error ${response.status}: ${errorBody}`)
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content

  if (!content) throw new Error('Groq returned an empty response.')

  return content
}

// ─── Safe JSON Parser ─────────────────────────────────────────────────────────

function parseJSON<T>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  return JSON.parse(cleaned) as T
}

// ─── generateQuestions ────────────────────────────────────────────────────────

export async function generateQuestions(
  role: string,
  difficulty: string,
  type: string,
  count: number
): Promise<GroqServiceResult<string[]>> {
  try {
    const prompt = questionPrompt(role, difficulty, type, count)
    const raw = await callGroq(prompt)
    const questions = parseJSON<string[]>(raw)

    if (!Array.isArray(questions)) {
      throw new Error('Expected a JSON array of questions.')
    }

    return { data: questions.slice(0, count), error: null, isLoading: false }
  } catch (err) {
    console.error('[generateQuestions]', err)
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to generate questions.',
      isLoading: false,
    }
  }
}

// ─── evaluateAnswer ───────────────────────────────────────────────────────────

export async function evaluateAnswer(
  question: string,
  answer: string,
  role: string
): Promise<GroqServiceResult<Feedback>> {
  try {
    const prompt = feedbackPrompt(question, answer, role)
    const raw = await callGroq(prompt)
    const feedback = parseJSON<Feedback>(raw)

    if (
      typeof feedback.whatWentWell !== 'string' ||
      typeof feedback.whatToImprove !== 'string' ||
      typeof feedback.betterAnswer !== 'string' ||
      typeof feedback.score !== 'number'
    ) {
      throw new Error('Feedback response is missing required fields.')
    }

    feedback.score = Math.min(10, Math.max(1, Math.round(feedback.score)))

    return { data: feedback, error: null, isLoading: false }
  } catch (err) {
    console.error('[evaluateAnswer]', err)
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to evaluate answer.',
      isLoading: false,
    }
  }
}

// ─── generateSummary ──────────────────────────────────────────────────────────

export async function generateSummary(
  feedbacks: Feedback[]
): Promise<GroqServiceResult<SessionSummary>> {
  try {
    if (feedbacks.length === 0) throw new Error('No feedback data to summarize.')

    const prompt = summaryPrompt(feedbacks)
    const raw = await callGroq(prompt)
    const summary = parseJSON<SessionSummary>(raw)

    if (
      typeof summary.strengths !== 'string' ||
      typeof summary.weaknesses !== 'string'
    ) {
      throw new Error('Summary response is missing required fields.')
    }

    return { data: summary, error: null, isLoading: false }
  } catch (err) {
    console.error('[generateSummary]', err)
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to generate summary.',
      isLoading: false,
    }
  }
}