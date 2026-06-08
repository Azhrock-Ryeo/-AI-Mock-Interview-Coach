import type { Grade } from '../../types/interview.types'

interface ScoreCardProps {
  score: number
  grade: Grade
}

function getGradeColor(grade: Grade): string {
  switch (grade) {
    case 'A': return 'text-emerald-400'
    case 'B': return 'text-teal-400'
    case 'C': return 'text-amber-400'
    case 'D': return 'text-orange-400'
    case 'F': return 'text-red-400'
  }
}

function getGradeBg(grade: Grade): string {
  switch (grade) {
    case 'A': return 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30'
    case 'B': return 'from-teal-500/20 to-teal-500/5 border-teal-500/30'
    case 'C': return 'from-amber-500/20 to-amber-500/5 border-amber-500/30'
    case 'D': return 'from-orange-500/20 to-orange-500/5 border-orange-500/30'
    case 'F': return 'from-red-500/20 to-red-500/5 border-red-500/30'
  }
}

function getScoreColor(score: number): string {
  if (score >= 8) return 'text-emerald-400'
  if (score >= 5) return 'text-amber-400'
  return 'text-red-400'
}

function getGradeLabel(grade: Grade): string {
  switch (grade) {
    case 'A': return 'Outstanding'
    case 'B': return 'Proficient'
    case 'C': return 'Satisfactory'
    case 'D': return 'Needs Work'
    case 'F': return 'Keep Practicing'
  }
}

function StarRating({ score }: { score: number }) {
  // Map 1–10 to 0–5 stars (with half-star rounding)
  const stars = Math.round((score / 10) * 5)
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < stars ? 'text-amber-400' : 'text-white/15'}`}
          fill="currentColor" viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function ScoreCard({ score, grade }: ScoreCardProps) {
  const roundedScore = Math.round(score * 10) / 10

  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${getGradeBg(grade)} p-6 flex flex-col items-center gap-4`}>
      {/* Big score */}
      <div className="text-center">
        <div className={`text-6xl font-black tracking-tight ${getScoreColor(score)}`}>
          {roundedScore.toFixed(1)}
        </div>
        <div className="text-sm text-white/40 mt-1">Overall Score</div>
      </div>

      {/* Divider */}
      <div className="w-12 h-px bg-white/10" />

      {/* Grade */}
      <div className="text-center">
        <div className={`text-5xl font-black ${getGradeColor(grade)}`}>{grade}</div>
        <div className="text-sm text-white/50 mt-1">{getGradeLabel(grade)}</div>
      </div>

      {/* Stars */}
      <StarRating score={score} />

      {/* Score bar */}
      <div className="w-full">
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              score >= 8 ? 'bg-emerald-400' :
              score >= 5 ? 'bg-amber-400' : 'bg-red-400'
            }`}
            style={{ width: `${(score / 10) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-white/30">0</span>
          <span className="text-xs text-white/30">10</span>
        </div>
      </div>
    </div>
  )
}