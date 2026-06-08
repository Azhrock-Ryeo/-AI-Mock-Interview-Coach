import { RouterProvider } from 'react-router-dom'
import { InterviewProvider } from './providers/InterviewProvider'
import router from './router'
import '@/styles/globals.css'
import '@/styles/mic.css'
import Timer from '../components/shared/Timer'
import MicButton from '../components/shared/MicButton'

export default function App() {
  return (
    <InterviewProvider>
      <RouterProvider router={router} />
      <Timer duration={90}/>
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
        <MicButton />
      </div>
    </InterviewProvider>
  )
}