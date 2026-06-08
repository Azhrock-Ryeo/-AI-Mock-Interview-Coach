import { useState, useEffect } from 'react'
import { getSessions, clearSessions } from '../../utils/storage'
import type { Session } from '../../types/interview.types'

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

function getScoreColor(score: number): string {
  if (score >= 8) return 'text-emerald-400'
  if (score >= 5) return 'text-amber-400'
  return 'text-red-400'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function HistoryList() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    setSessions(getSessions())
  }, [])

  function handleClear() {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    clearSessions()
    setSessions([])
    setConfirmClear(false)
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-sm text-white/30">No past sessions yet.</p>
        <p className="text-xs text-white/20 mt-1">Complete an interview to see your history here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Session rows */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-4 px-4 py-2 bg-white/5 border-b border-white/10">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Date</span>
          <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Role</span>
          <span className="text-xs font-semibold text-white/40 uppercase tracking-wider text-center">Score</span>
          <span className="text-xs font-semibold text-white/40 uppercase tracking-wider text-center">Grade</span>
        </div>

        {/* Rows */}
        {sessions.map((session) => (
          <div
            key={session.id}
            className="grid grid-cols-4 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors duration-150"
          >
            <span className="text-sm text-white/60">{formatDate(session.date)}</span>
            <span className="text-sm text-white/80 truncate pr-2">{session.setup.jobRole}</span>
            <span className={`text-sm font-semibold text-center ${getScoreColor(session.overallScore)}`}>
              {session.overallScore.toFixed(1)}
            </span>
            <div className="flex justify-center">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getGradeColor(session.grade)}`}>
                {session.grade}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Clear history button */}
      <div className="flex justify-end">
        <button
          onClick={handleClear}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
            confirmClear
              ? 'border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'border-white/10 bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10'
          }`}
        >
          {confirmClear ? '⚠️ Confirm clear history' : 'Clear History'}
        </button>
        {confirmClear && (
          <button
            onClick={() => setConfirmClear(false)}
            className="ml-2 text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white/40 hover:bg-white/10 transition-colors duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}