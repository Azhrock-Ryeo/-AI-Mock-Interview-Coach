import type { Feedback } from "../types/interview.types";

// ─── Question Generation Prompt ───────────────────────────────────────────────

export function questionPrompt(
  role: string,
  difficulty: string,
  type: string,
  count: number
): string {
  return `You are an expert technical interviewer. Generate exactly ${count} ${difficulty} ${type} interview questions for a ${role} position.

Rules:
- Questions must be appropriate for ${difficulty} difficulty
- For Technical: focus on coding, systems, tools, and domain knowledge
- For Behavioral: focus on past experiences, teamwork, conflict resolution (use STAR format scenarios)
- For Mixed: mix both technical and behavioral questions evenly
- Each question should be clear, specific, and professional
- Do NOT number the questions
- Do NOT include answers

Respond ONLY with a valid JSON array of strings. No explanation, no markdown, no extra text.

Example format:
["Question one here?", "Question two here?", "Question three here?"]`;
}

// ─── Answer Evaluation Prompt ─────────────────────────────────────────────────

export function feedbackPrompt(
  question: string,
  answer: string,
  role: string
): string {
  return `You are an expert interviewer evaluating a candidate's answer for a ${role} position.

Question asked:
"${question}"

Candidate's answer:
"${answer}"

Evaluate the answer thoroughly and respond ONLY with a valid JSON object. No explanation, no markdown, no extra text.

The JSON must have exactly these fields:
{
  "whatWentWell": "specific praise about what the candidate did well",
  "whatToImprove": "specific, actionable feedback on what was weak or missing",
  "betterAnswer": "a model answer that demonstrates what an ideal response looks like",
  "score": <integer from 1 to 10>
}

Scoring guide:
- 9-10: Exceptional, thorough, well-structured answer
- 7-8: Good answer with minor gaps
- 5-6: Adequate but missing key points
- 3-4: Weak answer, significant gaps
- 1-2: Poor or irrelevant answer`;
}

// ─── Session Summary Prompt ───────────────────────────────────────────────────

export function summaryPrompt(feedbacks: Feedback[]): string {
  const feedbackText = feedbacks
    .map(
      (f, i) =>
        `Question ${i + 1}:
  Score: ${f.score}/10
  What went well: ${f.whatWentWell}
  What to improve: ${f.whatToImprove}`
    )
    .join("\n\n");

  return `You are a career coach summarizing a mock interview session. Here are the results from each question:

${feedbackText}

Based on all the feedback above, write a concise overall summary of the candidate's performance.

Respond ONLY with a valid JSON object. No explanation, no markdown, no extra text.

The JSON must have exactly these fields:
{
  "strengths": "2-3 sentences highlighting the candidate's consistent strengths across the session",
  "weaknesses": "2-3 sentences identifying the key areas the candidate should focus on improving"
}`;
}