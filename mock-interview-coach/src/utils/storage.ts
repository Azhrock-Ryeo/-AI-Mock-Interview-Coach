import type { Session } from '../types/interview.types'

const STORAGE_KEY = 'ai_mock_interview_sessions'

// ─── saveSession ──────────────────────────────────────────────────────────────

export function saveSession(session: Session): void {
  try {
    const existing = getSessions()
    const updated = [session, ...existing]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('[saveSession] Failed to save session:', err)
  }
}

// ─── getSessions ──────────────────────────────────────────────────────────────

export function getSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Session[]
  } catch (err) {
    console.error('[getSessions] Failed to parse sessions:', err)
    return []
  }
}

// ─── clearSessions ────────────────────────────────────────────────────────────

export function clearSessions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.error('[clearSessions] Failed to clear sessions:', err)
  }
}