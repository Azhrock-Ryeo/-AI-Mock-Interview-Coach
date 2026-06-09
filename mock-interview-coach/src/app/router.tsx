import { createBrowserRouter, Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import ProtectedRoute from '../components/shared/ProtectedRoute'
import LandingPage from '../pages/LandingPage'
import InterviewPage from '../pages/InterviewPage'
import ResultsPage from '../pages/ResultsPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProgressPage from '../pages/ProgressPage'
import HistoryPage from '../pages/HistoryPage'
import SessionDetailPage from '../pages/SessionDetailPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

function RootLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export const router = createBrowserRouter([
  // Routes WITHOUT Navbar
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

  // Routes WITH Navbar
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <LandingPage />
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
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])