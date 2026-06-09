import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

export function useAuth() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      setError(getErrorMessage(err.code))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName: name })
      await setDoc(doc(db, 'users', user.uid), { name, email })
    } catch (err: any) {
      setError(getErrorMessage(err.code))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setError(null)
    try {
      await signOut(auth)
    } catch (err: any) {
      setError('Failed to log out.')
      throw err
    }
  }

  const signInWithGoogle = async () => {
    setError(null)
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider)
      await setDoc(
        doc(db, 'users', user.uid),
        { name: user.displayName, email: user.email },
        { merge: true }
      )
    } catch (err: any) {
      setError(getErrorMessage(err.code))
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { login, register, logout, signInWithGoogle, error, loading, setError }
}

function getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found': return 'No account found with this email.'
    case 'auth/wrong-password': return 'Incorrect password.'
    case 'auth/email-already-in-use': return 'This email is already registered.'
    case 'auth/weak-password': return 'Password must be at least 6 characters.'
    case 'auth/invalid-email': return 'Please enter a valid email address.'
    case 'auth/popup-closed-by-user': return 'Google sign-in was cancelled.'
    case 'auth/too-many-requests': return 'Too many attempts. Try again later.'
    default: return 'Something went wrong. Please try again.'
  }
}