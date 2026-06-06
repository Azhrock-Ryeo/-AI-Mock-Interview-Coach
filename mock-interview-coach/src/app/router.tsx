import { createBrowserRouter } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import InterviewPage from '../pages/InterviewPage'
import ResultsPage from '../pages/ResultsPage'
import NotFoundPage from '../pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/interview',
    element: <InterviewPage />,
  },
  {
    path: '/results',
    element: <ResultsPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router