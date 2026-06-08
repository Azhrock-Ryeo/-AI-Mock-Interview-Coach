import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { InterviewProvider } from './providers/InterviewProvider'
import LandingPage from '../pages/LandingPage'
import Interview from '../pages/InterviewPage'
import NotFoundPage from '../pages/NotFoundPage'
import '../index.css'

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