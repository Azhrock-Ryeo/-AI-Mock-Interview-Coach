import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from 'recharts'
import type { Session } from '../../types/interview.types'

interface ChartPoint {
  date: string
  score: number
  grade: string
  jobRole: string
}

interface Props {
  sessions: Session[]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as ChartPoint
  return (
    <div className="rounded-xl border border-white/10 bg-[#0f0f1a] px-4 py-3 text-sm shadow-xl">
      <p className="text-white/50 text-xs mb-1">{d.date}</p>
      <p className="text-white/80 font-medium">{d.jobRole}</p>
      <p className="text-violet-400 font-bold mt-1">
        Score: {d.score.toFixed(1)} &nbsp;·&nbsp; Grade: {d.grade}
      </p>
    </div>
  )
}

export function ProgressChart({ sessions }: Props) {
  const data: ChartPoint[] = [...sessions]
    .reverse()
    .map((s) => ({
      date: formatDate(s.date),
      score: s.overallScore,
      grade: s.grade,
      jobRole: s.setup.jobRole,
    }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#7c3aed"
          strokeWidth={2}
          dot={{ fill: '#7c3aed', r: 4, strokeWidth: 0 }}
          activeDot={{ fill: '#a78bfa', r: 6, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}