import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RegisterPage() {
  const { register, error, loading, setError } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({})

  function validate() {
    const errors: typeof fieldErrors = {}
    if (!name.trim()) errors.name = 'Name is required.'
    if (!email.trim()) errors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email.'
    if (!password) errors.password = 'Password is required.'
    else if (password.length < 6) errors.password = 'Min. 6 characters.'
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.'
    else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.'
    return errors
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const errors = validate()
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return }
    setFieldErrors({})
    try { await register(name.trim(), email.trim(), password); navigate('/') } catch {}
  }

  const inputStyle = (hasError?: string) => ({
    background:'rgba(255,255,255,0.06)', border:`1px solid ${hasError ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.12)'}`,
    borderRadius:'0.625rem', color:'#fff', fontSize:'0.95rem', padding:'0.7rem 1rem', outline:'none', width:'100%', boxSizing:'border-box' as any
  })

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0f0f1a,#1a1a2e,#16213e)', padding:'1.5rem', fontFamily:'Inter,system-ui,sans-serif' }}>
      <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'1.25rem', padding:'2.5rem', width:'100%', maxWidth:'420px', backdropFilter:'blur(12px)', boxShadow:'0 25px 50px rgba(0,0,0,0.4)' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>🚀</div>
          <h1 style={{ color:'#fff', fontSize:'1.75rem', fontWeight:700, margin:'0 0 0.4rem', letterSpacing:'-0.02em' }}>Create Account</h1>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.9rem', margin:0 }}>Join AI Mock Interview Coach today</p>
        </div>

        {error && <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.35)', color:'#fca5a5', padding:'0.75rem 1rem', borderRadius:'0.625rem', fontSize:'0.875rem', marginBottom:'1.25rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {[
            { label:'Full Name', type:'text', value:name, set:setName, error:fieldErrors.name, placeholder:'Alex Reyes' },
            { label:'Email', type:'email', value:email, set:setEmail, error:fieldErrors.email, placeholder:'you@example.com' },
            { label:'Password', type:'password', value:password, set:setPassword, error:fieldErrors.password, placeholder:'Min. 6 characters' },
            { label:'Confirm Password', type:'password', value:confirmPassword, set:setConfirmPassword, error:fieldErrors.confirmPassword, placeholder:'Re-enter your password' },
          ].map(({ label, type, value, set, error: err, placeholder }) => (
            <div key={label} style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
              <label style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.85rem', fontWeight:500 }}>{label}</label>
              <input type={type} placeholder={placeholder} value={value} onChange={e => set(e.target.value)} style={inputStyle(err)} />
              {err && <span style={{ color:'#fca5a5', fontSize:'0.8rem' }}>{err}</span>}
            </div>
          ))}

          <button type="submit" disabled={loading}
            style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', border:'none', borderRadius:'0.625rem', fontSize:'0.95rem', fontWeight:600, padding:'0.8rem', cursor:'pointer', marginTop:'0.4rem', opacity: loading ? 0.5 : 1 }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.45)', fontSize:'0.875rem', marginTop:'1.5rem', marginBottom:0 }}>
          Already have an account? <Link to="/login" style={{ color:'#818cf8', textDecoration:'none', fontWeight:500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}