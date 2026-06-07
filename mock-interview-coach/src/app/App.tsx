import { RouterProvider } from 'react-router-dom'
import { InterviewProvider } from './providers/InterviewProvider'
import router from './router'
import '../styles/globals.css'
import '../styles/mic.css'
import Timer from '../component/Timer'
import MicButton from '../component/MicButton.tsx'  // 👈 add this

export default function App() {
  return (
    <InterviewProvider>
      <RouterProvider router={router} />
      <Timer duration={90}/>

      {/*Temporary test — delete after confirming it works */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
        <MicButton />
      </div>
    </InterviewProvider>
  )
}