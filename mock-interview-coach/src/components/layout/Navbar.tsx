import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Moon, Zap } from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext'

const Navbar = () => {
  const [isDark, setIsDark] = useState(false)
  const { currentUser, logout } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('intervue_theme')
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    }
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('intervue_theme', next ? 'dark' : 'light')
  }

  async function handleLogout() {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Inter<span className="text-primary">vue</span>
          </span>
        </Link>

        {/* Nav links + actions */}
        <div className="flex items-center gap-2">

          {currentUser ? (
            <>
              {/* Logged-in links */}
              <Link
                to="/interview"
                className="hidden sm:block text-sm text-foreground/60 hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors duration-150"
              >
                Start Interview
              </Link>
              <Link
                to="/progress"
                className="hidden sm:block text-sm text-foreground/60 hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors duration-150"
              >
                Progress
              </Link>
              <Link
                to="/history"
                className="hidden sm:block text-sm text-foreground/60 hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors duration-150"
              >
                History
              </Link>

              {/* User name */}
              <span className="hidden sm:block text-sm text-foreground/40 px-2">
                {currentUser.displayName?.split(' ')[0] ?? currentUser.email?.split('@')[0]}
              </span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-sm text-foreground/60 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors duration-150"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Logged-out links */}
              <Link
                to="/login"
                className="text-sm text-foreground/60 hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors duration-150"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 px-3 py-1.5 rounded-lg transition-colors duration-150"
              >
                Register
              </Link>
            </>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-all duration-200 hover:bg-muted hover:scale-105 active:scale-95"
          >
            <motion.div
              key={isDark ? 'moon' : 'sun'}
              initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-foreground" />
              )}
            </motion.div>
          </button>

        </div>
      </div>
    </motion.header>
  )
}

export default Navbar