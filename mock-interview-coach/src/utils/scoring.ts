import type { Grade } from '../types/interview.types'

/**
 * Calculates the average of an array of scores.
 * Returns 0 if the array is empty.
 */
export function calculateAverage(scores: number[]): number {
  if (scores.length === 0) return 0
  const sum = scores.reduce((acc, score) => acc + score, 0)
  return Math.round((sum / scores.length) * 10) / 10
}

/**
 * Returns a letter grade based on a 1–10 score.
 * 9–10 → A, 7–8 → B, 5–6 → C, 3–4 → D, 1–2 → F
 */
export function getGrade(score: number): Grade {
  if (score >= 9) return 'A'
  if (score >= 7) return 'B'
  if (score >= 5) return 'C'
  if (score >= 3) return 'D'
  return 'F'
}

/**
 * Returns a Tailwind color class based on a 1–10 score.
 */
export function getScoreColor(score: number): string {
  if (score >= 8) return 'text-emerald-400'
  if (score >= 5) return 'text-amber-400'
  return 'text-red-400'
}