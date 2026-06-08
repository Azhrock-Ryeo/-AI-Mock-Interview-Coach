import { useEffect, useState } from "react"

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastProps {
  message: string
  variant?: ToastVariant
  duration?: number
  onDismiss?: () => void
}

export interface ToastItem extends ToastProps {
  id: string
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  error:   'border-red-500/40 bg-red-500/10 text-red-300',
  info:    'border-blue-500/40 bg-blue-500/10 text-blue-300',
}

const VARIANT_ICONS: Record<ToastVariant, string> = {
  success: '✅',
  error:   '❌',
  info:    'ℹ️',
}

export function Toast({
  message,
  variant = 'info',
  duration = 3000,
  onDismiss,
}: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10)
    const hideTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss?.(), 300)
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [duration, onDismiss])

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-xl
        text-sm font-medium max-w-sm w-full pointer-events-auto
        transition-all duration-300 ease-out
        ${VARIANT_STYLES[variant]}
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <span className="text-base shrink-0">{VARIANT_ICONS[variant]}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(() => onDismiss?.(), 300)
        }}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

let _setToasts: React.Dispatch<React.SetStateAction<ToastItem[]>> | null = null

export function toast(message: string, variant: ToastVariant = 'info', duration = 3000) {
  if (!_setToasts) {
    console.warn('ToastContainer is not mounted.')
    return
  }
  const id = crypto.randomUUID()
  _setToasts((prev) => [...prev, { id, message, variant, duration }])
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    _setToasts = setToasts
    return () => { _setToasts = null }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          variant={t.variant}
          duration={t.duration}
          onDismiss={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
        />
      ))}
    </div>
  )
}