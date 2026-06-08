import { useState } from 'react'
import type { Feedback } from '../../types/interview.types'

interface FeedbackCardProps {
  feedback: Feedback
  questionNumber: number
  question: string
}

function getScoreColor(score: number): string {
  if (score >= 8) return 'text-emerald-400'
  if (score >= 5) return 'text-amber-400'
  return 'text-red-400'
}

function getScoreBg(score: number): string {
  if (score >= 8) return 'bg-emerald-400/10 border-emerald-400/30'
  if (score >= 5) return 'bg-amber-400/10 border-amber-400/30'
  return 'bg-red-400/10 border-red-400/30'
}

function getScoreLabel(score: number): string {
  if (score >= 9) return 'Excellent'
  if (score >= 7) return 'Good'
  if (score >= 5) return 'Adequate'
  if (score >= 3) return 'Weak'
  return 'Poor'
}

export function FeedbackCard({ feedback, questionNumber, question }: FeedbackCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300">
      {/* Header — always visible, click to expand */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors duration-200"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-mono text-white/40 shrink-0">Q{questionNumber}</span>
          <p className="text-sm text-white/70 truncate">{question}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-3">
          {/* Score badge */}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getScoreBg(feedback.score)} ${getScoreColor(feedback.score)}`}>
            {feedback.score}/10 · {getScoreLabel(feedback.score)}
          </span>

          {/* Chevron */}
          <svg
            className={`w-4 h-4 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expandable body */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-4">

          {/* What went well */}
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">✅</span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">What you did well</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">{feedback.whatWentWell}</p>
          </div>

          {/* What to improve */}
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">⚠️</span>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">What to improve</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">{feedback.whatToImprove}</p>
          </div>

          {/* Better answer */}
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">💡</span>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">A better answer would be...</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">{feedback.betterAnswer}</p>
          </div>

          {/* Score bar */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white/40">Score</span>
              <span className={`text-xs font-bold ${getScoreColor(feedback.score)}`}>{feedback.score} / 10</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  feedback.score >= 8 ? 'bg-emerald-400' :
                  feedback.score >= 5 ? 'bg-amber-400' : 'bg-red-400'
                }`}
                style={{ width: `${(feedback.score / 10) * 100}%` }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}