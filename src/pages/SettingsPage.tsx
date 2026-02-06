import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import './MorePage.css'

export default function SettingsPage() {
  const { deleteProfile } = useAuth()
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    setError('')
    setLoading(true)
    const { error: err } = await deleteProfile()
    setLoading(false)
    if (err) {
      setError(err)
      return
    }
    setConfirmOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <div className="more-page">
      <header className="more-header">
        <Link to="/more" className="settings-back">← Back</Link>
        <h1>Settings</h1>
        <p className="more-email">Notification and account settings</p>
      </header>

      <nav className="more-nav">
        <span className="more-link disabled">Notification settings (Phase 2)</span>
        <span className="more-link disabled">Password reset (Phase 2)</span>
        <span className="more-link disabled">Account settings (Phase 2)</span>
      </nav>

      <section className="settings-danger">
        <h2 className="settings-section-title">Danger zone</h2>
        <p className="settings-section-desc">Deleting your profile will remove all your data. You can sign up again with the same email.</p>
        <button
          type="button"
          className="settings-delete-btn"
          onClick={() => setConfirmOpen(true)}
        >
          Delete profile
        </button>
      </section>

      {confirmOpen && (
        <div
          className="settings-confirm-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          onClick={(e) => e.target === e.currentTarget && setConfirmOpen(false)}
        >
          <div className="settings-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h2 id="delete-confirm-title">Delete your profile?</h2>
            <p>This will permanently delete your account, profile, and all associated data. You can sign up again with the same email afterward.</p>
            {error && <p className="auth-error">{error}</p>}
            <div className="settings-confirm-actions">
              <button
                type="button"
                className="settings-confirm-cancel"
                onClick={() => { setConfirmOpen(false); setError('') }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="settings-confirm-delete"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Deleting…' : 'Delete profile'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
