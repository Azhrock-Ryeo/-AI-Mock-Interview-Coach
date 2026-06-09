import { RouterProvider } from 'react-router-dom'
import { InterviewProvider } from './providers/InterviewProvider'
import { AuthProvider } from '../context/AuthContext'
import { router } from './router'
import '../index.css'

const App = () => (
  <AuthProvider>
    <InterviewProvider>
      <RouterProvider router={router} />
    </InterviewProvider>
  </AuthProvider>
)

export default App