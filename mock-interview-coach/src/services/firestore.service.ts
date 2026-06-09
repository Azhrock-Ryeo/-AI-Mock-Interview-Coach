import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Session } from '../types/interview.types'

export async function saveSession(uid: string, session: Session): Promise<void> {
  try {
    await setDoc(doc(db, 'users', uid, 'sessions', session.id), session)
  } catch (error) {
    console.error('Error saving session:', error)
    throw error
  }
}

export async function getSessions(uid: string): Promise<Session[]> {
  try {
    const snapshot = await getDocs(collection(db, 'users', uid, 'sessions'))
    return snapshot.docs.map(d => d.data() as Session)
  } catch (error) {
    console.error('Error getting sessions:', error)
    throw error
  }
}

export async function getSession(uid: string, sessionId: string): Promise<Session | null> {
  try {
    const snapshot = await getDoc(doc(db, 'users', uid, 'sessions', sessionId))
    if (!snapshot.exists()) return null
    return snapshot.data() as Session
  } catch (error) {
    console.error('Error getting session:', error)
    throw error
  }
}

export async function deleteSession(uid: string, sessionId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'users', uid, 'sessions', sessionId))
  } catch (error) {
    console.error('Error deleting session:', error)
    throw error
  }
}

export async function deleteAllSessions(uid: string): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, 'users', uid, 'sessions'))
    await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)))
  } catch (error) {
    console.error('Error deleting all sessions:', error)
    throw error
  }
}