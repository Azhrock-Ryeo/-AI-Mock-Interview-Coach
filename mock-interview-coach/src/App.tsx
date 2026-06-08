import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { InterviewProvider } from './context/InterviewContext'
import LandingPage from './pages/LandingPage'
import Interview from './pages/Interview'
import NotFoundPage from './pages/NotFoundPage'

const App = () => (
  <InterviewProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </InterviewProvider>
)

export default App