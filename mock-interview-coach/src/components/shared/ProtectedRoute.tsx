import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuthContext()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}