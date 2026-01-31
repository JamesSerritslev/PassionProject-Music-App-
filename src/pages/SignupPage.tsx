import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { UserRole } from '@/lib/supabase'
import './Auth.css'

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'musician', label: 'Musician' },
  { value: 'band', label: 'Band' },
  { value: 'venue', label: 'Venue' },
]

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('musician')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signUp(email, password, role)
    setLoading(false)
    if (err) {
      setError(err)
      return
    }
    navigate('/profile-setup', { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">BandScope</h1>
        <p className="auth-tagline">Create your account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="auth-error">{error}</p>}
          <label className="auth-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="auth-input"
            />
          </label>
          <label className="auth-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
              className="auth-input"
            />
          </label>
          <label className="auth-label">
            I am a
            <div className="auth-role-options">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={`auth-role-btn ${role === r.value ? 'active' : ''}`}
                  onClick={() => setRole(r.value)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </label>
          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
