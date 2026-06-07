// scoring.ts

/**
 * Calculates the average of an array of scores.
 * @param scores - Array of numeric scores
 * @returns The arithmetic mean, or 0 if the array is empty
 */
export function calculateAverage(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
}

/**
 * Returns a letter grade based on a numeric score (0–100).
 * 90–100 → A, 80–89 → B, 70–79 → C, 60–69 → D, <60 → F
 * @param score - Numeric score between 0 and 100
 * @returns Letter grade string: "A" | "B" | "C" | "D" | "F"
 */
export function getGrade(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

/**
 * Returns a Tailwind color class based on a score (1–10).
 * 8–10 → green, 5–7 → yellow, 1–4 → red
 * @param score - Numeric score between 1 and 10
 * @returns Tailwind text color class string
 */
export function getScoreColor(
  score: number
): "text-green-500" | "text-yellow-500" | "text-red-500" {
  if (score >= 8) return "text-green-500";
  if (score >= 5) return "text-yellow-500";
  return "text-red-500";
}