import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { getSession } from '../services/firestore.service'
import type { Session } from '../types/interview.types'

function getScoreColor(score: number): string {
  if (score >= 8) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
  if (score >= 5) return 'text-amber-400 bg-amber-400/10 border-amber-400/30'
  return 'text-red-400 bg-red-400/10 border-red-400/30'
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
    case 'B': return 'text-teal-400 bg-teal-400/10 border-teal-400/30'
    case 'C': return 'text-amber-400 bg-amber-400/10 border-amber-400/30'
    case 'D': return 'text-orange-400 bg-orange-400/10 border-orange-400/30'
    case 'F': return 'text-red-400 bg-red-400/10 border-red-400/30'
    default:  return 'text-white/40 bg-white/5 border-white/10'
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function SessionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuthContext()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!currentUser || !id) return
    getSession(currentUser.uid, id)
      .then((data) => {
        if (!data) setNotFound(true)
        else setSession(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [currentUser, id])

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="space-y-3 w-full max-w-2xl px-4 animate-pulse">
          <div className="h-6 bg-white/10 rounded w-1/3 mx-auto" />
          <div className="h-4 bg-white/10 rounded w-1/2 mx-auto" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 h-32" />
          ))}
        </div>
      </div>
    )
  }

  // Not found
  if (notFound || !session) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-white/40 text-lg">Session not found.</p>
          <button
            onClick={() => navigate('/history')}
            className="text-sm px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
          >
            ← Back to History
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-12 space-y-8">

        {/* Header */}
        <div className="text-center space-y-1">
          <p className="text-sm text-white/40 font-mono uppercase tracking-widest">Session Review</p>
          <h1 className="text-3xl font-bold text-white">{session.setup.jobRole}</h1>
          <p className="text-white/50 text-sm">
            {session.setup.difficulty} · {session.setup.interviewType} · {formatDate(session.date)}
          </p>
        </div>

        {/* Score + Grade */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Overall Score</p>
            <p className={`text-3xl font-bold ${session.overallScore >= 8 ? 'text-emerald-400' : session.overallScore >= 5 ? 'text-amber-400' : 'text-red-400'}`}>
              {session.overallScore.toFixed(1)}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Grade</p>
            <span className={`text-3xl font-bold px-3 py-1 rounded-full border ${getGradeColor(session.grade)}`}>
              {session.grade}
            </span>
          </div>
        </div>

        {/* Question breakdown */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">
            Question Breakdown
          </h2>

          {session.questions.map((question, i) => {
            const feedback = session.feedbacks[i]
            const score = session.scores[i]
            const answer = session.answers[i]
            if (!feedback) return null
            return (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
                {/* Question + score */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Question {i + 1}</p>
                    <p className="text-white/90 font-medium">{question}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border shrink-0 ${getScoreColor(score)}`}>
                    {score}/10
                  </span>
                </div>

                {/* User answer */}
                <div>
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Your Answer</p>
                  <p className="text-sm text-white/60 leading-relaxed bg-white/5 rounded-lg p-3">
                    {answer || <span className="italic text-white/30">No answer recorded.</span>}
                  </p>
                </div>

                {/* Feedback */}
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">✅ What went well</p>
                    <p className="text-xs text-white/65 leading-relaxed">{feedback.whatWentWell}</p>
                  </div>
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">🎯 To improve</p>
                    <p className="text-xs text-white/65 leading-relaxed">{feedback.whatToImprove}</p>
                  </div>
                  <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
                    <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">💡 Better answer</p>
                    <p className="text-xs text-white/65 leading-relaxed">{feedback.betterAnswer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate('/history')}
            className="flex-1 py-3 px-6 rounded-xl border border-white/10 bg-white/5 text-white/70 font-semibold hover:bg-white/10 transition-colors duration-200"
          >
            ← Back to History
          </button>
          <button
            onClick={() => navigate('/interview', { state: { setup: session.setup } })}
            className="flex-1 py-3 px-6 rounded-xl border border-violet-500/40 bg-violet-500/10 text-violet-300 font-semibold hover:bg-violet-500/20 transition-colors duration-200"
          >
            🔁 Try Same Setup Again
          </button>
        </div>

      </div>
    </div>
  )
}