import { RouterProvider } from 'react-router-dom'
import { InterviewProvider } from './providers/InterviewProvider'
import router from './router'
import '../styles/globals.css'
import Timer from '../component/Timer'

export default function App() {
  return (
    <InterviewProvider>
      <RouterProvider router={router} />
      <Timer duration={90}/>
    </InterviewProvider>
  )
}