import { useEffect, useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { getSessions } from '../services/firestore.service'
import { ProgressChart } from '../components/shared/ProgressChart'
import type { Session } from '../types/interview.types'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
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

function getScoreColor(score: number): string {
  if (score >= 8) return 'text-emerald-400'
  if (score >= 5) return 'text-amber-400'
  return 'text-red-400'
}

function getTrendMessage(sessions: Session[]): string {
  if (sessions.length < 2) return ''
  const sorted = [...sessions].reverse() // oldest first
  const first = sorted[0].overallScore
  const last = sorted[sorted.length - 1].overallScore
  return last > first ? '📈 You are improving!' : '💪 Keep practicing!'
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color ?? 'text-white'}`}>{value}</p>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse">
      <div className="h-3 bg-white/10 rounded w-1/2 mx-auto mb-2" />
      <div className="h-7 bg-white/10 rounded w-1/3 mx-auto" />
    </div>
  )
}

export default function ProgressPage() {
  const { currentUser } = useAuthContext()
  const [sessions, setSessions] = useState<Session[]>([])
  const [filtered, setFiltered] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('All')

  useEffect(() => {
    if (!currentUser) return
    getSessions(currentUser.uid)
      .then((data) => {
        setSessions(data)
        setFiltered(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [currentUser])

  // Unique job roles for filter
  const roles = ['All', ...Array.from(new Set(sessions.map((s) => s.setup.jobRole)))]

  function handleRoleFilter(role: string) {
    setRoleFilter(role)
    setFiltered(role === 'All' ? sessions : sessions.filter((s) => s.setup.jobRole === role))
  }

  // Stats
  const total = filtered.length
  const avg = total > 0
    ? (filtered.reduce((sum, s) => sum + s.overallScore, 0) / total).toFixed(1)
    : '—'
  const best = total > 0
    ? Math.max(...filtered.map((s) => s.overallScore)).toFixed(1)
    : '—'
  const trend = getTrendMessage(filtered)

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-12 space-y-10">

        {/* Header */}
        <div className="text-center space-y-1">
          <p className="text-sm text-white/40 font-mono uppercase tracking-widest">Your Journey</p>
          <h1 className="text-3xl font-bold text-white">Progress</h1>
          {trend && <p className="text-white/50 text-sm">{trend}</p>}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-4">
          {loading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : (
            <>
              <StatCard label="Total Sessions" value={String(total)} />
              <StatCard
                label="Average Score"
                value={avg}
                color={avg !== '—' ? (Number(avg) >= 8 ? 'text-emerald-400' : Number(avg) >= 5 ? 'text-amber-400' : 'text-red-400') : undefined}
              />
              <StatCard
                label="Best Score"
                value={best}
                color={best !== '—' ? 'text-violet-400' : undefined}
              />
            </>
          )}
        </div>

        {/* Chart */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">Score Over Time</h2>
          {loading ? (
            <div className="rounded-xl border border-white/10 bg-white/5 h-60 animate-pulse" />
          ) : total === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-sm text-white/30">No data yet.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <ProgressChart sessions={filtered} />
            </div>
          )}
        </div>

        {/* Role Filter */}
        {!loading && roles.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleFilter(role)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  roleFilter === role
                    ? 'border-violet-500/60 bg-violet-500/20 text-violet-300'
                    : 'border-white/10 bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        )}

        {/* Timeline List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">Timeline</h2>

          {loading ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 h-16" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-sm text-white/30">No sessions found.</p>
              <p className="text-xs text-white/20 mt-1">Complete an interview to start tracking progress.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-4 px-4 py-2 bg-white/5 border-b border-white/10">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Date</span>
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Role</span>
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider text-center">Score</span>
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider text-center">Grade</span>
              </div>
              {filtered.map((session) => (
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
          )}
        </div>

      </div>
    </div>
  )
}