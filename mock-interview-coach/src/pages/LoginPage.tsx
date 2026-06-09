import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login, signInWithGoogle, error, loading, setError } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  function validate() {
    const errors: { email?: string; password?: string } = {}
    if (!email.trim()) errors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email.'
    if (!password) errors.password = 'Password is required.'
    return errors
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const errors = validate()
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return }
    setFieldErrors({})
    try { await login(email, password); navigate('/') } catch {}
  }

  async function handleGoogle() {
    setError(null)
    setFieldErrors({})
    try { await signInWithGoogle(); navigate('/') } catch {}
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0f0f1a,#1a1a2e,#16213e)', padding:'1.5rem', fontFamily:'Inter,system-ui,sans-serif' }}>
      <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'1.25rem', padding:'2.5rem', width:'100%', maxWidth:'420px', backdropFilter:'blur(12px)', boxShadow:'0 25px 50px rgba(0,0,0,0.4)' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>🔥</div>
          <h1 style={{ color:'#fff', fontSize:'1.75rem', fontWeight:700, margin:'0 0 0.4rem', letterSpacing:'-0.02em' }}>Welcome Back</h1>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.9rem', margin:0 }}>Sign in to AI Mock Interview Coach</p>
        </div>

        {error && <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.35)', color:'#fca5a5', padding:'0.75rem 1rem', borderRadius:'0.625rem', fontSize:'0.875rem', marginBottom:'1.25rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
            <label style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.85rem', fontWeight:500 }}>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
              style={{ background:'rgba(255,255,255,0.06)', border:`1px solid ${fieldErrors.email ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.12)'}`, borderRadius:'0.625rem', color:'#fff', fontSize:'0.95rem', padding:'0.7rem 1rem', outline:'none', width:'100%', boxSizing:'border-box' as any }} />
            {fieldErrors.email && <span style={{ color:'#fca5a5', fontSize:'0.8rem' }}>{fieldErrors.email}</span>}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
            <label style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.85rem', fontWeight:500 }}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
              style={{ background:'rgba(255,255,255,0.06)', border:`1px solid ${fieldErrors.password ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.12)'}`, borderRadius:'0.625rem', color:'#fff', fontSize:'0.95rem', padding:'0.7rem 1rem', outline:'none', width:'100%', boxSizing:'border-box' as any }} />
            {fieldErrors.password && <span style={{ color:'#fca5a5', fontSize:'0.8rem' }}>{fieldErrors.password}</span>}
          </div>

          <button type="submit" disabled={loading}
            style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', border:'none', borderRadius:'0.625rem', fontSize:'0.95rem', fontWeight:600, padding:'0.8rem', cursor:'pointer', marginTop:'0.4rem', opacity: loading ? 0.5 : 1 }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', margin:'1.25rem 0', color:'rgba(255,255,255,0.25)', fontSize:'0.85rem' }}>
          <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.1)' }} />
          or
          <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.1)' }} />
        </div>

        <button onClick={handleGoogle} disabled={loading}
          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.6rem', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'0.625rem', color:'rgba(255,255,255,0.85)', fontSize:'0.95rem', fontWeight:500, padding:'0.75rem', cursor:'pointer', width:'100%', opacity: loading ? 0.5 : 1 }}>
          <svg viewBox="0 0 48 48" width="20" height="20">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.45)', fontSize:'0.875rem', marginTop:'1.5rem', marginBottom:0 }}>
          Don't have an account? <Link to="/register" style={{ color:'#818cf8', textDecoration:'none', fontWeight:500 }}>Create one</Link>
        </p>
      </div>
    </div>
  )
}