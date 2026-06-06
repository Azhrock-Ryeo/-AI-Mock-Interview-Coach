import { RouterProvider } from 'react-router-dom'
import { InterviewProvider } from './providers/InterviewProvider'
import router from './router'
import '../styles/globals.css'

export default function App() {
  return (
    <InterviewProvider>
      <RouterProvider router={router} />
    </InterviewProvider>
  )
}