
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterviewContext } from '../context/InterviewContext'
import { getSessions } from '../utils/storage'
import type { InterviewSetup, Difficulty, InterviewType } from '../types/interview.types'

const JOB_ROLES = ['Software Engineer', 'Designer', 'Product Manager', 'Marketing', 'Data Analyst', 'HR']
const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard']
const INTERVIEW_TYPES: InterviewType[] = ['Technical', 'Behavioral', 'Mixed']
const NUM_QUESTIONS = [5, 7, 10]

export default function LandingPage() {
  const navigate = useNavigate()
  const { setSetup } = useInterviewContext()
  const [pastSessionCount, setPastSessionCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    userName: '',
    jobRole: '',
    difficulty: '' as Difficulty | '',
    interviewType: '' as InterviewType | '',
    questionCount: '' as number | '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})

  useEffect(() => {
    setPastSessionCount(getSessions().length)
  }, [])

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof typeof form, string>> = {}
    if (!form.userName.trim()) newErrors.userName = 'Name is required'
    if (!form.jobRole) newErrors.jobRole = 'Please select a job role'
    if (!form.difficulty) newErrors.difficulty = 'Please select a difficulty'
    if (!form.interviewType) newErrors.interviewType = 'Please select interview type'
    if (!form.questionCount) newErrors.questionCount = 'Please select number of questions'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    setLoading(true)

    const setup: InterviewSetup = {
      userName: form.userName.trim(),
      jobRole: form.jobRole,
      difficulty: form.difficulty as Difficulty,
      interviewType: form.interviewType as InterviewType,
      questionCount: form.questionCount as number,
    }

    // Save to context (for ResultsPage)
    setSetup(setup)

    // Also write to sessionStorage so InterviewPage can read it on mount
    sessionStorage.setItem('interview_role', setup.jobRole)
    sessionStorage.setItem('interview_difficulty', setup.difficulty.toLowerCase())
    sessionStorage.setItem('interview_type', setup.interviewType.toLowerCase())
    sessionStorage.setItem('interview_count', String(setup.questionCount))
    sessionStorage.setItem('interview_userName', setup.userName)

    setTimeout(() => {
      navigate('/interview')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-violet-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-16 space-y-10">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium">
            ✦ AI-Powered Interview Practice
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Ace Your Next{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">
              Interview
            </span>
          </h1>
          <p className="text-white/50 text-base sm:text-lg max-w-lg mx-auto">
            Practice with AI-generated questions tailored to your role and get instant feedback.
          </p>

          {pastSessionCount > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/50">
              🕓 You've completed{' '}
              <strong className="text-white">{pastSessionCount}</strong>{' '}
              past {pastSessionCount === 1 ? 'session' : 'sessions'}
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-semibold">Configure Your Session</h2>
            <p className="text-sm text-white/40 mt-0.5">Fill in the details to start your personalized interview.</p>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/70">
              <span className="mr-1.5">👤</span>Your Name
            </label>
            <input
              type="text"
              value={form.userName}
              onChange={e => update('userName', e.target.value)}
              placeholder="e.g. Alex Johnson"
              className={`w-full rounded-xl border bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50 ${
                errors.userName ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
              }`}
            />
            {errors.userName && <p className="text-xs text-red-400">{errors.userName}</p>}
          </div>

          {/* 2-col grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Job Role */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70">
                <span className="mr-1.5">💼</span>Job Role
              </label>
              <select
                value={form.jobRole}
                onChange={e => update('jobRole', e.target.value)}
                className={`w-full rounded-xl border bg-[#0a0a0f] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50 ${
                  errors.jobRole ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                } ${!form.jobRole ? 'text-white/30' : ''}`}
              >
                <option value="" disabled>Select a role</option>
                {JOB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.jobRole && <p className="text-xs text-red-400">{errors.jobRole}</p>}
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70">
                <span className="mr-1.5">📊</span>Difficulty
              </label>
              <select
                value={form.difficulty}
                onChange={e => update('difficulty', e.target.value as Difficulty)}
                className={`w-full rounded-xl border bg-[#0a0a0f] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50 ${
                  errors.difficulty ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                } ${!form.difficulty ? 'text-white/30' : ''}`}
              >
                <option value="" disabled>Select difficulty</option>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.difficulty && <p className="text-xs text-red-400">{errors.difficulty}</p>}
            </div>

            {/* Interview Type */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70">
                <span className="mr-1.5">💬</span>Interview Type
              </label>
              <select
                value={form.interviewType}
                onChange={e => update('interviewType', e.target.value as InterviewType)}
                className={`w-full rounded-xl border bg-[#0a0a0f] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50 ${
                  errors.interviewType ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                } ${!form.interviewType ? 'text-white/30' : ''}`}
              >
                <option value="" disabled>Select type</option>
                {INTERVIEW_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.interviewType && <p className="text-xs text-red-400">{errors.interviewType}</p>}
            </div>

            {/* Number of Questions */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70">
                <span className="mr-1.5">#</span>Number of Questions
              </label>
              <select
                value={form.questionCount}
                onChange={e => update('questionCount', Number(e.target.value))}
                className={`w-full rounded-xl border bg-[#0a0a0f] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50 ${
                  errors.questionCount ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
                } ${!form.questionCount ? 'text-white/30' : ''}`}
              >
                <option value="" disabled>Select count</option>
                {NUM_QUESTIONS.map(n => <option key={n} value={n}>{n} Questions</option>)}
              </select>
              {errors.questionCount && <p className="text-xs text-red-400">{errors.questionCount}</p>}
            </div>
          </div>

          {/* Preview badges */}
          {(form.difficulty || form.interviewType) && (
            <div className="flex flex-wrap gap-2">
              {form.difficulty && (
                <span className="px-3 py-1 rounded-full text-xs font-medium border border-violet-500/30 bg-violet-500/10 text-violet-300">
                  {form.difficulty}
                </span>
              )}
              {form.interviewType && (
                <span className="px-3 py-1 rounded-full text-xs font-medium border border-sky-500/30 bg-sky-500/10 text-sky-300">
                  {form.interviewType}
                </span>
              )}
              {form.questionCount && (
                <span className="px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-white/50">
                  {form.questionCount} Questions
                </span>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Starting…
              </>
            ) : (
              <>✦ Start Interview</>
            )}
          </button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 text-xs text-white/30">
          {['✦ AI-Generated Questions', '✦ Role-Specific Practice', '✦ Multiple Difficulty Levels', '✦ Instant Feedback'].map(f => (
            <span key={f} className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5">{f}</span>
          ))}
        </div>

      </div>
    </div>
  )
}
