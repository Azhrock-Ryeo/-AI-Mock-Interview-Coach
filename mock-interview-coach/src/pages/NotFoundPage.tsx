import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white gap-4">
      <h1 className="text-6xl font-bold text-indigo-400">404</h1>
      <p className="text-slate-400 text-lg">Page not found</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
      >
        Go Home
      </button>
    </div>
  )
}