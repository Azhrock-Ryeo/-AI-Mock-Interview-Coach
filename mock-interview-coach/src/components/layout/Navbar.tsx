import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Zap, Menu, X } from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext'

const Navbar = () => {
  const [isDark, setIsDark] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const { currentUser, logout } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    navigate('/')
  }

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.07]"
      style={{ background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">Inter<span className="text-violet-400">vue</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {currentUser && (
            <>
              <Link to="/progress"
                className="px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium">
                Progress
              </Link>
              <Link to="/history"
                className="px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium">
                History
              </Link>
            </>
          )}

          <button
            onClick={() => setIsDark(v => !v)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2 ml-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {initials}
                </div>
                <span className="text-sm text-white/70 font-medium max-w-[100px] truncate">{displayName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors font-medium"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <Link to="/login"
                className="px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium">
                Sign in
              </Link>
              <Link to="/register"
                className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
                Get started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsDark(v => !v)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-t border-white/[0.07] px-4 py-3 flex flex-col gap-1"
            style={{ background: 'rgba(10,10,15,0.97)' }}
          >
            {currentUser && (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">{displayName}</span>
                    <span className="text-xs text-white/40 truncate">{currentUser.email}</span>
                  </div>
                </div>

                <Link to="/progress"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Progress
                </Link>

                <Link to="/history"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  History
                </Link>

                <div className="my-1 border-t border-white/[0.07]" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-colors text-sm font-medium w-full text-left"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Sign out
                </button>
              </>
            )}

            {!currentUser && (
              <>
                <Link to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
                  Sign in
                </Link>
                <Link to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-colors text-sm font-semibold">
                  Get started
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar