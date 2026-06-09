import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterviewContext } from '../app/providers/InterviewProvider'

import QuestionCard from '../components/shared/QuestionCard'
import ProgressBar from '../components/shared/ProgressBar'
import TranscriptBox from '../components/shared/Transcript'
import { FeedbackCardSkeleton } from '../components/ui/Skeleton'

import { generateQuestions, evaluateAnswer } from '../services/groq.service'
import type { Feedback } from '../types/interview.types'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'

type Category = 'Technical' | 'Behavioral'
interface Question { text: string; category: Category }
type PagePhase = 'loading' | 'answering' | 'evaluating' | 'feedback' | 'done'

function ScoreBadge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 8) return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' }
    if (score >= 5) return { bg: '#fffbeb', text: '#d97706', border: '#fde68a' }
    return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' }
  }
  const { bg, text, border } = getColor()
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700, background: bg, color: text, border: `1.5px solid ${border}`, fontVariantNumeric: 'tabular-nums' }}>
      {score}/10
    </span>
  )
}

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const [expanded, setExpanded] = useState(true)
  return (
    <>
      <style>{`
        .fc-card { font-family: 'DM Sans', sans-serif; background: #ffffff; border: 1.5px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06); animation: fc-slide-in 0.38s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes fc-slide-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .fc-header { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; cursor:pointer; user-select:none; border-bottom:1px solid transparent; transition:border-color 0.2s; }
        .fc-header.open { border-bottom-color:#f3f4f6; }
        .fc-body { display:grid; grid-template-rows:0fr; transition:grid-template-rows 0.3s ease; }
        .fc-body.open { grid-template-rows:1fr; }
        .fc-body-inner { overflow:hidden; }
        .fc-sections { padding:16px 20px; display:flex; flex-direction:column; gap:12px; }
        .fc-section { border-radius:10px; padding:12px 14px; }
        .fc-section-label { font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:6px; }
        .fc-section-text { font-size:13.5px; line-height:1.6; color:#374151; }
        .fc-score-row { display:flex; align-items:center; gap:10px; margin-top:4px; }
        .fc-score-track { flex:1; height:6px; background:#f3f4f6; border-radius:999px; overflow:hidden; }
        .fc-score-fill { height:100%; border-radius:999px; transition:width 0.8s cubic-bezier(0.4,0,0.2,1); }
      `}</style>
      <div className="fc-card">
        <div className={`fc-header ${expanded ? 'open' : ''}`} onClick={() => setExpanded(v => !v)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontSize: 15, flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 3L6 10.5 3 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Answer Feedback</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ScoreBadge score={feedback.score} />
            <svg style={{ width: 20, height: 20, color: '#9ca3af', transition: 'transform 0.25s ease', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }} viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className={`fc-body ${expanded ? 'open' : ''}`}>
          <div className="fc-body-inner">
            <div className="fc-sections">
              <div className="fc-section" style={{ background: '#f0fdf4' }}>
                <p className="fc-section-label" style={{ color: '#16a34a' }}>✓ What went well</p>
                <p className="fc-section-text">{feedback.whatWentWell}</p>
              </div>
              <div className="fc-section" style={{ background: '#fff7ed' }}>
                <p className="fc-section-label" style={{ color: '#c2410c' }}>↑ What to improve</p>
                <p className="fc-section-text">{feedback.whatToImprove}</p>
              </div>
              <div className="fc-section" style={{ background: '#eff6ff' }}>
                <p className="fc-section-label" style={{ color: '#1d4ed8' }}>💡 Stronger answer</p>
                <p className="fc-section-text">{feedback.betterAnswer}</p>
              </div>
              <div className="fc-score-row">
                <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, minWidth: 40 }}>Score</span>
                <div className="fc-score-track">
                  <div className="fc-score-fill" style={{ width: `${(feedback.score / 10) * 100}%`, background: feedback.score >= 8 ? 'linear-gradient(90deg,#10b981,#34d399)' : feedback.score >= 5 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#ef4444,#f87171)' }} />
                </div>
                <ScoreBadge score={feedback.score} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function InlineTimer({ duration, onExpire, isRunning }: { duration: number; onExpire?: () => void; isRunning: boolean }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { setTimeLeft(duration) }, [duration])

  useEffect(() => {
    if (!isRunning) { if (intervalRef.current) clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current!); onExpire?.(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, onExpire])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  const isWarning = timeLeft <= 30 && timeLeft > 10
  const isCritical = timeLeft <= 10

  return (
    <>
      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }`}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 10, background: isCritical ? '#fef2f2' : isWarning ? '#fffbeb' : '#f9fafb', border: `1.5px solid ${isCritical ? '#fecaca' : isWarning ? '#fde68a' : '#e5e7eb'}`, transition: 'all 0.3s ease' }}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ color: isCritical ? '#dc2626' : isWarning ? '#d97706' : '#6b7280' }}>
          <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M7.5 4.5V7.5L9.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontFamily: "'DM Sans', sans-serif", color: isCritical ? '#dc2626' : isWarning ? '#d97706' : '#374151', animation: isCritical ? 'pulse 1s ease-in-out infinite' : 'none' }}>
          {display}
        </span>
      </div>
    </>
  )
}

function MicButton({ isListening, isSupported, onToggle }: { isListening: boolean; isSupported: boolean; onToggle: () => void }) {
  return (
    <>
      <style>{`
        .mic-btn { width:72px; height:72px; border-radius:50%; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; position:relative; z-index:1; background:linear-gradient(135deg,#2563eb 0%,#4f46e5 100%); box-shadow:0 4px 20px rgba(37,99,235,0.35); transition:transform 0.15s ease, box-shadow 0.15s ease; }
        .mic-btn.listening { background:linear-gradient(135deg,#dc2626 0%,#e11d48 100%); box-shadow:0 4px 20px rgba(220,38,38,0.35); }
        .mic-btn:hover:not(:disabled) { transform:scale(1.06); }
        .mic-btn:active:not(:disabled) { transform:scale(0.96); }
        .mic-btn:disabled { opacity:0.45; cursor:not-allowed; }
        .mic-ring { position:absolute; border-radius:50%; border:2px solid rgba(220,38,38,0.35); animation:ring-expand 1.5s ease-out infinite; }
        .mic-ring:nth-child(2) { animation-delay:0.4s; }
        .mic-ring:nth-child(3) { animation-delay:0.8s; }
        @keyframes ring-expand { 0% { width:72px; height:72px; opacity:0.7; } 100% { width:120px; height:120px; opacity:0; } }
      `}</style>
      <div style={{ position: 'relative', width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isListening && (<><span className="mic-ring" /><span className="mic-ring" /><span className="mic-ring" /></>)}
        <button onClick={onToggle} disabled={!isSupported} className={`mic-btn${isListening ? ' listening' : ''}`}>
          <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
            <rect x="15" y="4" width="14" height="22" rx="7" fill="white" fillOpacity="0.95" />
            <path d="M8 21C8 28.732 14.268 35 22 35C29.732 35 36 28.732 36 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <line x1="22" y1="35" x2="22" y2="41" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="41" x2="28" y2="41" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </>
  )
}

// ─── Exit Confirmation Dialog ─────────────────────────────────────────────────
function ExitDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease' }}>
      <style>{`@keyframes fadeIn { from { opacity:0; } to { opacity:1; } } @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div style={{ background: '#ffffff', borderRadius: 20, padding: '32px', maxWidth: 420, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', animation: 'slideUp 0.25s ease', fontFamily: "'DM Sans', sans-serif" }}>
        {/* Icon */}
        <div style={{ width: 56, height: 56, borderRadius: 16, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Text */}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', textAlign: 'center', margin: '0 0 8px' }}>
          Exit Interview?
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 1.6, margin: '0 0 28px' }}>
          Your progress will be lost and this session won't be saved. Are you sure you want to leave?
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #e5e7eb', background: '#f9fafb', color: '#374151', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s ease' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
            onMouseLeave={e => (e.currentTarget.style.background = '#f9fafb')}
          >
            Continue Interview
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#dc2626,#e11d48)', color: '#ffffff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 12px rgba(220,38,38,0.3)', transition: 'all 0.15s ease' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Exit Interview
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── InterviewPage ─────────────────────────────────────────────────────────────
export default function InterviewPage() {
  const navigate = useNavigate()
  const { setQuestions: setCtxQuestions, setAnswers: setCtxAnswers, setFeedbacks: setCtxFeedbacks, setScores: setCtxScores, resetInterview } = useInterviewContext()

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<PagePhase>('loading')
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [allFeedbacks, setAllFeedbacks] = useState<Feedback[]>([])
  const [allAnswers, setAllAnswers] = useState<string[]>([])
  const [allScores, setAllScores] = useState<number[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [timerKey, setTimerKey] = useState(0)
  const [showExitDialog, setShowExitDialog] = useState(false)

  const { isListening, isSupported, startListening, stopListening, transcript: liveTranscript, error: speechError } = useSpeechRecognition()

  useEffect(() => {
    if (liveTranscript) {
      setTranscript(prev => prev + (prev.trim() ? ' ' : '') + liveTranscript)
    }
  }, [liveTranscript])

  useEffect(() => { loadQuestions() }, [])

  async function loadQuestions() {
    setPhase('loading')
    setLoadError(null)

    const role = sessionStorage.getItem('interview_role') || 'Software Engineer'
    const difficulty = sessionStorage.getItem('interview_difficulty') || 'medium'
    const type = sessionStorage.getItem('interview_type') || 'mixed'
    const count = parseInt(sessionStorage.getItem('interview_count') || '5', 10)

    const result = await generateQuestions(role, difficulty, type, count)

    if (result.error || !result.data) {
      setLoadError(result.error ?? 'Failed to load questions.')
      return
    }

    const mapped: Question[] = result.data.map((text, i) => ({
      text,
      category: type === 'behavioral' ? 'Behavioral' : type === 'technical' ? 'Technical' : i % 2 === 0 ? 'Technical' : 'Behavioral',
    }))

    setQuestions(mapped)
    setCtxQuestions(result.data)
    setCurrentIndex(0)
    setTranscript('')
    setFeedback(null)
    setPhase('answering')
  }

  async function handleSubmit() {
    if (!transcript.trim()) return
    if (isListening) stopListening()
    setPhase('evaluating')

    const role = sessionStorage.getItem('interview_role') || 'Software Engineer'
    const current = questions[currentIndex]
    const result = await evaluateAnswer(current.text, transcript, role)

    if (result.error || !result.data) {
      setPhase('answering')
      return
    }

    const newFeedback = result.data
    const newFeedbacks = [...allFeedbacks, newFeedback]
    const newAnswers = [...allAnswers, transcript]
    const newScores = [...allScores, newFeedback.score]

    setFeedback(newFeedback)
    setAllFeedbacks(newFeedbacks)
    setAllAnswers(newAnswers)
    setAllScores(newScores)

    setCtxFeedbacks(newFeedbacks)
    setCtxAnswers(newAnswers)
    setCtxScores(newScores)

    setPhase('feedback')
  }

  function handleNext() {
    const nextIndex = currentIndex + 1
    if (nextIndex >= questions.length) {
      navigate('/results')
      return
    }
    setCurrentIndex(nextIndex)
    setTranscript('')
    setFeedback(null)
    setTimerKey(k => k + 1)
    setPhase('answering')
  }

  function handleTimerExpire() {
    if (phase === 'answering') {
      if (transcript.trim()) handleSubmit()
      else {
        // Auto skip on timer expire only — add empty answer
        const newAnswers = [...allAnswers, '']
        setAllAnswers(newAnswers)
        setCtxAnswers(newAnswers)
        handleNext()
      }
    }
  }

  function handleExitConfirm() {
    if (isListening) stopListening()
    resetInterview()
    navigate('/')
  }

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const canSubmit = transcript.trim().length > 0 && phase === 'answering'
  const TIMER_SECONDS = 120

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        .ip-root { font-family:'DM Sans',sans-serif; min-height:100vh; background:#f9fafb; display:flex; flex-direction:column; }
        .ip-topbar { display:flex; align-items:center; justify-content:space-between; padding:18px 32px; background:#ffffff; border-bottom:1.5px solid #f3f4f6; position:sticky; top:0; z-index:10; }
        .ip-logo { font-family:'DM Serif Display',serif; font-size:20px; color:#111827; display:flex; align-items:center; gap:8px; }
        .ip-logo-dot { width:8px; height:8px; border-radius:50%; background:#2563eb; animation:ip-pulse 2s ease-in-out infinite; }
        @keyframes ip-pulse { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.4); opacity:0.6; } }
        .ip-main { flex:1; max-width:740px; width:100%; margin:0 auto; padding:40px 24px 80px; display:flex; flex-direction:column; gap:28px; }
        .ip-answer-section { background:#ffffff; border:1.5px solid #e5e7eb; border-radius:20px; padding:28px; display:flex; flex-direction:column; gap:20px; box-shadow:0 1px 3px rgba(0,0,0,0.04); animation:ip-fade-up 0.35s ease both; }
        @keyframes ip-fade-up { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .ip-answer-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
        .ip-answer-label { font-size:12px; font-weight:700; letter-spacing:0.07em; text-transform:uppercase; color:#6b7280; display:flex; align-items:center; gap:6px; }
        .ip-mic-row { display:flex; align-items:center; justify-content:center; flex-direction:column; gap:10px; }
        .ip-mic-label { font-size:12.5px; font-weight:500; color:#9ca3af; transition:color 0.3s; }
        .ip-mic-label.listening { color:#dc2626; }
        .ip-actions { display:flex; gap:12px; flex-wrap:wrap; }
        .ip-btn { display:inline-flex; align-items:center; gap:7px; padding:11px 22px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; border:none; transition:all 0.15s ease; font-family:'DM Sans',sans-serif; }
        .ip-btn:active:not(:disabled) { transform:scale(0.97); }
        .ip-btn-primary { background:#2563eb; color:#ffffff; box-shadow:0 2px 8px rgba(37,99,235,0.28); }
        .ip-btn-primary:hover:not(:disabled) { background:#1d4ed8; }
        .ip-btn-primary:disabled { background:#bfdbfe; cursor:not-allowed; box-shadow:none; }
        .ip-btn-ghost { background:transparent; color:#6b7280; border:1.5px solid #e5e7eb; }
        .ip-btn-ghost:hover:not(:disabled) { background:#f9fafb; color:#374151; border-color:#d1d5db; }
        .ip-btn-danger { background:transparent; color:#dc2626; border:1.5px solid #fecaca; }
        .ip-btn-danger:hover { background:#fef2f2; border-color:#fca5a5; }
        .ip-btn-success { background:#059669; color:#ffffff; box-shadow:0 2px 8px rgba(5,150,105,0.28); }
        .ip-btn-success:hover { background:#047857; }
        .ip-loading-center { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:20px; }
        .ip-spinner { width:40px; height:40px; border:3px solid #e5e7eb; border-top-color:#2563eb; border-radius:50%; animation:ip-spin 0.8s linear infinite; }
        @keyframes ip-spin { to { transform:rotate(360deg); } }
        .ip-error-box { background:#fef2f2; border:1.5px solid #fecaca; border-radius:14px; padding:20px 24px; display:flex; flex-direction:column; gap:12px; align-items:flex-start; }
        .ip-evaluating { display:flex; flex-direction:column; align-items:center; gap:14px; padding:32px; background:#ffffff; border:1.5px solid #e5e7eb; border-radius:20px; text-align:center; }
        .ip-divider { display:flex; align-items:center; gap:12px; color:#d1d5db; font-size:12px; }
        .ip-divider::before,.ip-divider::after { content:''; flex:1; height:1px; background:#e5e7eb; }
        .ip-speech-error { font-size:12px; color:#dc2626; background:#fef2f2; border-radius:8px; padding:6px 12px; }
      `}</style>

      {/* Exit Dialog */}
      {showExitDialog && (
        <ExitDialog
          onConfirm={handleExitConfirm}
          onCancel={() => setShowExitDialog(false)}
        />
      )}

      <div className="ip-root">
        {/* Top bar — custom, no Navbar */}
        <header className="ip-topbar">
          <div className="ip-logo">
            <div className="ip-logo-dot" />
            Intervue
          </div>

          {phase !== 'loading' && questions.length > 0 && (
            <div style={{ flex: 1, maxWidth: 380, margin: '0 32px' }}>
              <ProgressBar current={currentIndex + (phase === 'feedback' ? 1 : 0)} total={questions.length} />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {phase === 'answering' && (
              <InlineTimer key={timerKey} duration={TIMER_SECONDS} onExpire={handleTimerExpire} isRunning={phase === 'answering'} />
            )}
            {/* Exit button */}
            {phase !== 'loading' && (
              <button
                className="ip-btn ip-btn-danger"
                onClick={() => setShowExitDialog(true)}
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Exit
              </button>
            )}
          </div>
        </header>

        {/* Main */}
        <main className="ip-main">

          {phase === 'loading' && !loadError && (
            <div className="ip-loading-center">
              <div className="ip-spinner" />
              <p style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Preparing your interview questions…</p>
            </div>
          )}

          {phase === 'loading' && loadError && (
            <div className="ip-loading-center">
              <div className="ip-error-box" style={{ maxWidth: 480, width: '100%' }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#dc2626' }}>Could not load questions</p>
                <p style={{ fontSize: 13.5, color: '#7f1d1d', lineHeight: 1.5 }}>{loadError}</p>
                <button className="ip-btn ip-btn-primary" onClick={loadQuestions}>Try again</button>
              </div>
            </div>
          )}

          {(phase === 'answering' || phase === 'evaluating' || phase === 'feedback') && currentQuestion && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6b7280' }}>
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>

              <QuestionCard question={currentQuestion.text} category={currentQuestion.category} questionKey={currentIndex} />

              {phase === 'evaluating' && (
                <div className="ip-evaluating">
                  <div className="ip-spinner" />
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Evaluating your answer…</p>
                  <p style={{ fontSize: 12.5, color: '#9ca3af' }}>Our AI is reviewing your response and preparing detailed feedback.</p>
                  <FeedbackCardSkeleton />
                </div>
              )}

              {phase === 'answering' && (
                <div className="ip-answer-section">
                  <div className="ip-answer-header">
                    <span className="ip-answer-label">Your answer</span>
                    {speechError && <span className="ip-speech-error">{speechError}</span>}
                  </div>

                  <div className="ip-mic-row">
                    <MicButton
                      isListening={isListening}
                      isSupported={isSupported}
                      onToggle={() => { if (isListening) stopListening(); else startListening() }}
                    />
                    <p className={`ip-mic-label${isListening ? ' listening' : ''}`}>
                      {!isSupported ? 'Speech not supported in this browser' : isListening ? 'Listening — click to stop' : 'Click mic to speak your answer'}
                    </p>
                  </div>

                  <div className="ip-divider">or type below</div>

                  <TranscriptBox transcript={transcript} onChange={setTranscript} isListening={isListening} />

                  {/* Submit only — no skip button */}
                  <div className="ip-actions">
                    <button
                      className="ip-btn ip-btn-primary"
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      style={{ flex: 1 }}
                    >
                      Submit Answer
                    </button>
                  </div>
                </div>
              )}

              {phase === 'feedback' && feedback && (
                <>
                  <FeedbackCard feedback={feedback} />
                  <div className="ip-actions">
                    <button
                      className={`ip-btn ${isLastQuestion ? 'ip-btn-success' : 'ip-btn-primary'}`}
                      onClick={handleNext}
                      style={{ flex: 1 }}
                    >
                      {isLastQuestion ? '🎉 See Results' : 'Next Question →'}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}