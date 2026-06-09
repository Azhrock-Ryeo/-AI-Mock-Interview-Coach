import { createBrowserRouter } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import InterviewPage from '../pages/InterviewPage'
import ResultsPage from '../pages/ResultsPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProgressPage from '../pages/ProgressPage'
import HistoryPage from '../pages/HistoryPage'
import SessionDetailPage from '../pages/SessionDetailPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProtectedRoute from '../components/shared/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/interview',
    element: (
      <ProtectedRoute>
        <InterviewPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/results',
    element: (
      <ProtectedRoute>
        <ResultsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/progress',
    element: (
      <ProtectedRoute>
        <ProgressPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <HistoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/history/:id',
    element: (
      <ProtectedRoute>
        <SessionDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router