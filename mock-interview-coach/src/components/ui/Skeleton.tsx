// ─── Base Skeleton Block ──────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-lg bg-white/10 ${className}`} />
  )
}

// ─── QuestionCard Skeleton ────────────────────────────────────────────────────
// Matches the shape of QuestionCard while Groq is loading questions

export function QuestionCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4 animate-pulse">
      {/* Question number tag */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>
      {/* Question text — 3 lines */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  )
}

// ─── FeedbackCard Skeleton ────────────────────────────────────────────────────
// Matches the shape of FeedbackCard while Groq is evaluating an answer

export function FeedbackCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden animate-pulse">
      {/* Header row */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Expanded body */}
      <div className="px-4 pb-4 border-t border-white/10 pt-4 space-y-3">
        {/* Section 1 */}
        <div className="rounded-lg bg-white/5 p-3 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        {/* Section 2 */}
        <div className="rounded-lg bg-white/5 p-3 space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        {/* Score bar */}
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
    </div>
  )
}

// ─── TextSkeleton ─────────────────────────────────────────────────────────────
// Generic multi-line text placeholder — pass `lines` to control count

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  const widths = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3']
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${widths[i % widths.length]}`} />
      ))}
    </div>
  )
}