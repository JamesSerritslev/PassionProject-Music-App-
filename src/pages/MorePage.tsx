import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import './MorePage.css'

export default function MorePage() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="more-page">
      <header className="more-header">
        <h1>More</h1>
        {user && (
          <p className="more-email">{user.email}</p>
        )}
      </header>

      <nav className="more-nav">
        <Link to="/settings" className="more-link">Settings</Link>
        <Link to="/profile/edit" className="more-link">Edit profile</Link>
        {(profile?.role === 'band' || profile?.role === 'venue') && (
          <Link to="/profile/events/new" className="more-link">Create event</Link>
        )}
        <button type="button" className="more-link more-logout" onClick={handleLogout}>
          Log out
        </button>
      </nav>
    </div>
  )
}
