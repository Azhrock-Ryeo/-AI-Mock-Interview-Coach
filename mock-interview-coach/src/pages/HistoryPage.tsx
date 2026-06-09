import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { getSessions, deleteSession, deleteAllSessions } from '../services/firestore.service'
import type { Session } from '../types/interview.types'

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
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function HistoryPage() {
  const { currentUser } = useAuthContext()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmClearAll, setConfirmClearAll] = useState(false)
  const [clearingAll, setClearingAll] = useState(false)

  useEffect(() => {
    if (!currentUser) return
    getSessions(currentUser.uid)
      .then(setSessions)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [currentUser])

  async function handleDelete(sessionId: string) {
    if (confirmDeleteId !== sessionId) {
      setConfirmDeleteId(sessionId)
      return
    }
    if (!currentUser) return
    setDeletingId(sessionId)
    try {
      await deleteSession(currentUser.uid, sessionId)
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  async function handleClearAll() {
    if (!confirmClearAll) {
      setConfirmClearAll(true)
      return
    }
    if (!currentUser) return
    setClearingAll(true)
    try {
      await deleteAllSessions(currentUser.uid)
      setSessions([])
    } catch (err) {
      console.error('Clear all failed:', err)
    } finally {
      setClearingAll(false)
      setConfirmClearAll(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-12 space-y-8">

        {/* Header */}
        <div className="text-center space-y-1">
          <p className="text-sm text-white/40 font-mono uppercase tracking-widest">All Sessions</p>
          <h1 className="text-3xl font-bold text-white">History</h1>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="rounded-xl border border-white/10 overflow-hidden animate-pulse">
            <div className="grid grid-cols-5 px-4 py-2 bg-white/5 border-b border-white/10 gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 bg-white/10 rounded" />
              ))}
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-5 px-4 py-3 border-b border-white/5 gap-2">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-3 bg-white/10 rounded" />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && sessions.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-white/30 text-sm">No sessions yet.</p>
            <p className="text-white/20 text-xs mt-1">Complete an interview to see your history here.</p>
            <button
              onClick={() => navigate('/interview')}
              className="mt-4 px-4 py-2 rounded-xl border border-violet-500/40 bg-violet-500/10 text-violet-300 text-sm font-semibold hover:bg-violet-500/20 transition-colors"
            >
              Start Interview
            </button>
          </div>
        )}

        {/* Sessions table */}
        {!loading && sessions.length > 0 && (
          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-5 px-4 py-2 bg-white/5 border-b border-white/10">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Date</span>
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Role</span>
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider text-center">Score</span>
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider text-center">Grade</span>
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider text-center">Action</span>
              </div>

              {/* Rows */}
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="grid grid-cols-5 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors duration-150 cursor-pointer"
                  onClick={() => navigate(`/history/${session.id}`)}
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
                  <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDelete(session.id)}
                      disabled={deletingId === session.id}
                      className={`text-xs px-2 py-1 rounded-lg border transition-all duration-200 disabled:opacity-50 ${
                        confirmDeleteId === session.id
                          ? 'border-red-500/50 bg-red-500/20 text-red-400'
                          : 'border-white/10 bg-white/5 text-white/30 hover:text-red-400 hover:border-red-500/30'
                      }`}
                    >
                      {deletingId === session.id
                        ? '…'
                        : confirmDeleteId === session.id
                        ? 'Confirm'
                        : 'Delete'}
                    </button>
                    {confirmDeleteId === session.id && deletingId !== session.id && (
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="ml-1 text-xs px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-white/30 hover:bg-white/10"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Clear all */}
            <div className="flex justify-end gap-2">
              {confirmClearAll && !clearingAll && (
                <button
                  onClick={() => setConfirmClearAll(false)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white/40 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleClearAll}
                disabled={clearingAll}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 disabled:opacity-50 ${
                  confirmClearAll
                    ? 'border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'border-white/10 bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10'
                }`}
              >
                {clearingAll ? 'Clearing…' : confirmClearAll ? '⚠️ Confirm clear all' : 'Clear All History'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}