import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import './BottomNav.css'

const navItems = [
  { to: '/', label: 'Musicians', icon: '👥' },
  { to: '/events', label: 'Events', icon: '📅' },
  { to: '/profile', label: 'Profile', icon: '👤' },
  { to: '/more', label: 'More', icon: '⋯' },
]

const publicNavItems = [
  { to: '/', label: 'Musicians', icon: '👥' },
  { to: '/events', label: 'Events', icon: '📅' },
]

export default function SideNav() {
  const { user } = useAuth()

  return (
    <>
      {!user && (
        <div className="top-auth-bar">
          <Link to="/signup" className="top-auth-btn top-auth-signup">Sign Up!</Link>
          <Link to="/login" className="top-auth-btn top-auth-login">Login</Link>
        </div>
      )}

      <nav className="side-nav" role="navigation" aria-label="Main">
        <Link to="/" className="side-nav-brand" aria-label="BandScope Home">
          <span className="side-nav-brand-bar" />
          <span className="side-nav-brand-text">BandScope</span>
        </Link>

        {(user ? navItems : publicNavItems).map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `side-nav-link ${isActive ? 'active' : ''}`}
          end={to === '/' || to === '/profile'}
        >
          <span className="side-nav-icon" aria-hidden>{icon}</span>
          <span className="side-nav-label">{label}</span>
        </NavLink>
      ))}
      </nav>
    </>
  )
}
