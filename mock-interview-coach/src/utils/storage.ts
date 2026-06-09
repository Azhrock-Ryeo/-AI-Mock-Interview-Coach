import type { Session } from '../types/interview.types'
import {
  saveSession as firestoreSave,
  getSessions as firestoreGetAll,
  getSession as firestoreGetOne,
  deleteSession as firestoreDelete,
  deleteAllSessions as firestoreDeleteAll,
} from '../services/firestore.service'

const STORAGE_KEY = 'ai_mock_interview_sessions'

// ── Firestore-backed functions (require uid) ──────────────────────────────────

export async function saveSessionForUser(uid: string, session: Session): Promise<void> {
  await firestoreSave(uid, session)
}

export async function getSessionsForUser(uid: string): Promise<Session[]> {
  return await firestoreGetAll(uid)
}

export async function getSessionForUser(uid: string, sessionId: string): Promise<Session | null> {
  return await firestoreGetOne(uid, sessionId)
}

export async function deleteSessionForUser(uid: string, sessionId: string): Promise<void> {
  await firestoreDelete(uid, sessionId)
}

export async function deleteAllSessionsForUser(uid: string): Promise<void> {
  await firestoreDeleteAll(uid)
}

// ── Legacy localStorage (kept so existing pages don't break yet) ──────────────

export function getSessions(): Session[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveSession(session: Session): void {
  try {
    const existing = getSessions()
    const updated = [session, ...existing]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('[saveSession] Failed:', err)
  }
}

export function clearSessions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.error('[clearSessions] Failed:', err)
  }
}

export function deleteSessionById(sessionId: string): void {
  const sessions = getSessions().filter(s => s.id !== sessionId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}