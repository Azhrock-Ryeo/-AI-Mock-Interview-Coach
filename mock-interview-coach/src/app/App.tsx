import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { InterviewProvider } from './providers/InterviewProvider'
import { AuthProvider } from '../context/AuthContext'
import LandingPage from '../pages/LandingPage'
import Interview from '../pages/InterviewPage'
import NotFoundPage from '../pages/NotFoundPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProtectedRoute from '../components/shared/ProtectedRoute'
import '../index.css'

const App = () => (
  <AuthProvider>
    <InterviewProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/interview" element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </InterviewProvider>
  </AuthProvider>
)

export default App