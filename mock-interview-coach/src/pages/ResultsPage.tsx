
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterviewContext } from '../app/providers/InterviewProvider'
import { ScoreCard } from '../components/shared/ScoreCard'
import { FeedbackCard } from '../components/shared/FeedbackCard'
import { HistoryList } from '../components/shared/HistoryList'
import { generateSummary } from '../services/groq.service'
import { calculateAverage, getGrade } from '../utils/scoring'
import { saveSession } from '../utils/storage'
import type { Session, SessionSummary } from '../types/interview.types'

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SummarySkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-4 bg-white/10 rounded w-full" />
      <div className="h-4 bg-white/10 rounded w-5/6" />
    </div>
  )
}

// ─── ResultsPage ──────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const navigate = useNavigate()
  const {
    setup,
    questions,
    answers,
    feedbacks,
    scores,
    resetInterview,
  } = useInterviewContext()

  const [summary, setSummary] = useState<SessionSummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const overallScore = calculateAverage(scores)
  const grade = getGrade(overallScore)

  // ─── Guard: redirect if no session data ───────────────────────────────────
  useEffect(() => {
    if (!setup || questions.length === 0) {
      navigate('/')
    }
  }, [setup, questions, navigate])

  // ─── Generate AI summary ──────────────────────────────────────────────────
useEffect(() => {
  if (feedbacks.length === 0) return

  setSummaryLoading(true)
  generateSummary(feedbacks)
    .then((result) => {
      if (result.error) {
        setSummaryError(result.error)
      } else {
        setSummary(result.data)   // ← .data here
      }
      setSummaryLoading(false)
    })
    .catch((err) => {
      console.error(err)
      setSummaryError('Could not generate summary. Please try again.')
      setSummaryLoading(false)
    })
}, [feedbacks])

  // ─── Auto-save session ────────────────────────────────────────────────────
  useEffect(() => {
    if (!setup || saved || feedbacks.length === 0) return

    const session: Session = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      setup,
      questions,
      answers,
      feedbacks,
      scores,
      overallScore,
      grade,
    }

    saveSession(session)
    setSaved(true)
  }, [setup, feedbacks, saved])

  // ─── Handlers ─────────────────────────────────────────────────────────────

  function handleTryAgain() {
    // Keep setup, reset session data only
    const currentSetup = setup
    resetInterview()
    // Re-apply setup so the interview page knows what to load
    if (currentSetup) {
      // InterviewProvider's resetInterview clears setup too,
      // so we navigate with state as a fallback
      navigate('/interview', { state: { setup: currentSetup } })
    }
  }

  function handleNewInterview() {
    resetInterview()
    navigate('/')
  }

  if (!setup) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-12 space-y-10">

        {/* ── Header ── */}
        <div className="text-center space-y-1">
          <p className="text-sm text-white/40 font-mono uppercase tracking-widest">Session Complete</p>
          <h1 className="text-3xl font-bold text-white">
            {setup.userName}'s Results
          </h1>
          <p className="text-white/50 text-sm">{setup.jobRole} · {setup.difficulty} · {setup.interviewType}</p>
        </div>

        {/* ── Score Card ── */}
        <ScoreCard score={overallScore} grade={grade} />

        {/* ── AI Summary ── */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">
            AI Coach Summary
          </h2>

          {summaryLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">Strengths</p>
                <SummarySkeleton />
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">Areas to Improve</p>
                <SummarySkeleton />
              </div>
            </div>
          ) : summaryError ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {summaryError}
            </div>
          ) : summary ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">💪 Strengths</p>
                <p className="text-sm text-white/75 leading-relaxed">{summary.strengths}</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">🎯 Areas to Improve</p>
                <p className="text-sm text-white/75 leading-relaxed">{summary.weaknesses}</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* ── Per-question Feedback ── */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">
            Question Breakdown
          </h2>
          {questions.map((q, i) => (
            feedbacks[i] ? (
              <FeedbackCard
                key={i}
                feedback={feedbacks[i]}
                questionNumber={i + 1}
                question={q}
              />
            ) : null
          ))}
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleTryAgain}
            className="flex-1 py-3 px-6 rounded-xl border border-violet-500/40 bg-violet-500/10 text-violet-300 font-semibold hover:bg-violet-500/20 transition-colors duration-200"
          >
            🔁 Try Again
          </button>
          <button
            onClick={handleNewInterview}
            className="flex-1 py-3 px-6 rounded-xl border border-white/10 bg-white/5 text-white/70 font-semibold hover:bg-white/10 transition-colors duration-200"
          >
            🏠 New Interview
          </button>
        </div>

        {/* ── Past Sessions ── */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">
            Past Sessions
          </h2>
          <HistoryList />
        </div>

      </div>
    </div>
  )
}
