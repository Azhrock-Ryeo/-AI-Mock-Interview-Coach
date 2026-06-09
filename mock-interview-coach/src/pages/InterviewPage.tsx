import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterviewContext } from '../app/providers/InterviewProvider'

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
  if (score >= 8) return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 tabular-nums">{score}/10</span>
  if (score >= 5) return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30 bg-amber-500/10 text-amber-400 tabular-nums">{score}/10</span>
  return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border border-red-500/30 bg-red-500/10 text-red-400 tabular-nums">{score}/10</span>
}

function QuestionCard({ question, category, questionKey }: { question: string; category: Category; questionKey: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#13131f] p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-xs uppercase tracking-widest text-violet-400 font-semibold">{category}</span>
        <span className="text-xs text-white/30">Question {questionKey + 1}</span>
      </div>
      <p className="text-lg font-semibold text-white leading-relaxed">{question}</p>
    </div>
  )
}

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const [expanded, setExpanded] = useState(true)
  const scoreColor = feedback.score >= 8 ? 'from-emerald-500 to-emerald-400' : feedback.score >= 5 ? 'from-amber-500 to-amber-400' : 'from-red-500 to-red-400'
  return (
    <div className="rounded-2xl border border-white/10 bg-[#13131f] overflow-hidden">
      <div className={`flex items-center justify-between px-5 py-4 cursor-pointer select-none ${expanded ? 'border-b border-white/10' : ''}`} onClick={() => setExpanded(v => !v)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 3L6 10.5 3 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <span className="text-sm font-semibold text-white/90">Answer Feedback</span>
        </div>
        <div className="flex items-center gap-3">
          <ScoreBadge score={feedback.score} />
          <svg className="w-5 h-5 text-white/30 transition-transform duration-200" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }} viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {expanded && (
        <div className="p-5 flex flex-col gap-3">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">✓ What went well</p>
            <p className="text-sm text-white/70 leading-relaxed">{feedback.whatWentWell}</p>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">↑ What to improve</p>
            <p className="text-sm text-white/70 leading-relaxed">{feedback.whatToImprove}</p>
          </div>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-2">💡 Stronger answer</p>
            <p className="text-sm text-white/70 leading-relaxed">{feedback.betterAnswer}</p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-white/30 font-semibold w-10">Score</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${scoreColor} transition-all duration-700`} style={{ width: `${(feedback.score / 10) * 100}%` }} />
            </div>
            <ScoreBadge score={feedback.score} />
          </div>
        </div>
      )}
    </div>
  )
}

function InlineTimer({ duration, onExpire, isRunning }: { duration: number; onExpire?: () => void; isRunning: boolean }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => { setTimeLeft(duration) }, [duration])
  useEffect(() => {
    if (!isRunning) { if (intervalRef.current) clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { clearInterval(intervalRef.current!); onExpire?.(); return 0 } return prev - 1 })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, onExpire])
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  const isWarning = timeLeft <= 30 && timeLeft > 10
  const isCritical = timeLeft <= 10
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-bold tabular-nums transition-all duration-300 ${isCritical ? 'border-red-500/40 bg-red-500/10 text-red-400' : isWarning ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' : 'border-white/10 bg-white/5 text-white/60'}`}>
      <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M7.5 4.5V7.5L9.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span>{display}</span>
    </div>
  )
}

function MicButton({ isListening, isSupported, onToggle }: { isListening: boolean; isSupported: boolean; onToggle: () => void }) {
  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      {isListening && (
        <>
          <span className="absolute w-20 h-20 rounded-full bg-red-500/20 animate-ping" />
          <span className="absolute w-28 h-28 rounded-full bg-red-500/10 animate-ping" style={{ animationDelay: '0.4s' }} />
        </>
      )}
      <button
        onClick={onToggle}
        disabled={!isSupported}
        className={`w-16 h-16 rounded-full flex items-center justify-center relative z-10 transition-all duration-200 border-none cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${isListening ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30 scale-105' : 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30 hover:scale-105'}`}
      >
        <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
          <rect x="15" y="4" width="14" height="22" rx="7" fill="white" fillOpacity="0.95" />
          <path d="M8 21C8 28.732 14.268 35 22 35C29.732 35 36 28.732 36 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <line x1="22" y1="35" x2="22" y2="41" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="41" x2="28" y2="41" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

function ExitDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#13131f] border border-white/10 rounded-2xl p-8 max-w-sm w-[90%] shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-white text-center mb-2">Exit Interview?</h2>
        <p className="text-sm text-white/40 text-center leading-relaxed mb-7">Your progress will be lost and this session won't be saved.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-white/70 text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer">Keep Going</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-semibold transition-colors cursor-pointer">Exit</button>
        </div>
      </div>
    </div>
  )
}

export default function InterviewPage() {
  const navigate = useNavigate()
  const { setQuestions: setCtxQuestions, setAnswers: setCtxAnswers, setFeedbacks: setCtxFeedbacks, setScores: setCtxScores, resetInterview } = useInterviewContext()

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<PagePhase>('loading')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [allFeedbacks, setAllFeedbacks] = useState<Feedback[]>([])
  const [allAnswers, setAllAnswers] = useState<string[]>([])
  const [allScores, setAllScores] = useState<number[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [timerKey, setTimerKey] = useState(0)
  const [showExitDialog, setShowExitDialog] = useState(false)

  // ✅ FIX: Use transcript DIRECTLY from the hook — do NOT append it in a useEffect.
  // The hook already manages final + interim text internally via finalTranscriptRef.
  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,        // ← use this directly as the answer
    setTranscript,     // ← used to clear on next question
    error: speechError,
  } = useSpeechRecognition()

  // ✅ NO liveTranscript useEffect here — that was the word-doubling bug

  useEffect(() => { loadQuestions() }, [])

  async function loadQuestions() {
    setPhase('loading'); setLoadError(null)
    const role = sessionStorage.getItem('interview_role') || 'Software Engineer'
    const difficulty = sessionStorage.getItem('interview_difficulty') || 'medium'
    const type = sessionStorage.getItem('interview_type') || 'mixed'
    const count = parseInt(sessionStorage.getItem('interview_count') || '5', 10)
    const result = await generateQuestions(role, difficulty, type, count)
    if (result.error || !result.data) { setLoadError(result.error ?? 'Failed to load questions.'); return }
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
    if (result.error || !result.data) { setPhase('answering'); return }
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
    if (nextIndex >= questions.length) { navigate('/results'); return }
    setCurrentIndex(nextIndex)
    setTranscript('')   // ← clears via hook's setTranscript
    setFeedback(null)
    setTimerKey(k => k + 1)
    setPhase('answering')
  }

  function handleTimerExpire() {
    if (phase === 'answering') {
      if (transcript.trim()) handleSubmit()
      else { const newAnswers = [...allAnswers, '']; setAllAnswers(newAnswers); setCtxAnswers(newAnswers); handleNext() }
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

  // ✅ FIX: This page renders its OWN full layout (header + main).
  // Make sure your router renders InterviewPage WITHOUT a wrapping RootLayout/Navbar.
  // In router.tsx, the /interview route should NOT be nested inside the layout route.
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0f' }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {showExitDialog && <ExitDialog onConfirm={handleExitConfirm} onCancel={() => setShowExitDialog(false)} />}

      {/* Topbar — this page manages its own header, no Navbar */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 border-b border-white/[0.07]"
        style={{ background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          <span className="font-bold text-white text-sm">Inter<span className="text-violet-400">vue</span></span>
        </div>
        {phase !== 'loading' && questions.length > 0 && (
          <div className="flex-1 max-w-xs mx-6">
            <ProgressBar current={currentIndex + (phase === 'feedback' ? 1 : 0)} total={questions.length} />
          </div>
        )}
        <div className="flex items-center gap-2">
          {phase === 'answering' && (
            <InlineTimer key={timerKey} duration={TIMER_SECONDS} onExpire={handleTimerExpire} isRunning />
          )}
          {phase !== 'loading' && (
            <button onClick={() => setShowExitDialog(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-colors cursor-pointer">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Exit
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="relative flex-1 w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">

        {phase === 'loading' && !loadError && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin" />
            <p className="text-sm text-white/30 font-medium">Preparing your questions…</p>
          </div>
        )}

        {phase === 'loading' && loadError && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex flex-col gap-3">
              <p className="text-sm font-semibold text-red-400">Could not load questions</p>
              <p className="text-sm text-white/40 leading-relaxed">{loadError}</p>
              <button onClick={loadQuestions} className="self-start px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors cursor-pointer">Try again</button>
            </div>
          </div>
        )}

        {(phase === 'answering' || phase === 'evaluating' || phase === 'feedback') && currentQuestion && (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-white/25">
              Question {currentIndex + 1} <span className="text-white/15">/ {questions.length}</span>
            </p>

            <QuestionCard question={currentQuestion.text} category={currentQuestion.category} questionKey={currentIndex} />

            {phase === 'evaluating' && (
              <div className="rounded-2xl border border-white/10 bg-[#13131f] p-8 flex flex-col items-center gap-4 text-center">
                <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin" />
                <p className="text-sm font-semibold text-white/80">Evaluating your answer…</p>
                <p className="text-xs text-white/25">AI is reviewing your response and preparing feedback.</p>
                <FeedbackCardSkeleton />
              </div>
            )}

            {phase === 'answering' && (
              <div className="rounded-2xl border border-white/10 bg-[#13131f] p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/25">Your Answer</span>
                  {speechError && <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1">{speechError}</span>}
                </div>

                <div className="flex flex-col items-center gap-3 py-2">
                  <MicButton
                    isListening={isListening}
                    isSupported={isSupported}
                    onToggle={() => { if (isListening) stopListening(); else startListening() }}
                  />
                  <p className={`text-xs font-semibold transition-colors duration-200 ${isListening ? 'text-red-400' : 'text-white/25'}`}>
                    {!isSupported ? 'Speech not supported in this browser' : isListening ? '● Listening — click to stop' : 'Click mic to speak your answer'}
                  </p>
                </div>

                {/* Speech-only: transcript is read-only, no typing allowed */}
                <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: '#0d0d18' }}>
                  <TranscriptBox transcript={transcript} isListening={isListening} readOnly />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-25 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 cursor-pointer"
                >
                  Submit Answer
                </button>
              </div>
            )}

            {phase === 'feedback' && feedback && (
              <>
                <FeedbackCard feedback={feedback} />
                <button
                  onClick={handleNext}
                  className={`w-full py-3 rounded-xl text-white text-sm font-semibold transition-colors cursor-pointer ${isLastQuestion ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-violet-600 hover:bg-violet-500'}`}
                >
                  {isLastQuestion ? '🎉 See Results' : 'Next Question →'}
                </button>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}