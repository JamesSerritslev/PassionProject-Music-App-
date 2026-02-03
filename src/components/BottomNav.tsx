import { NavLink, Link } from 'react-router-dom'
import './BottomNav.css'

const navItems = [
  { to: '/', label: 'Musicians', icon: '👥' },
  { to: '/events', label: 'Events', icon: '📅' },
  { to: '/profile', label: 'Profile', icon: '👤' },
  { to: '/more', label: 'More', icon: '⋯' },
]

export default function SideNav() {
  return (
    <nav className="side-nav" role="navigation" aria-label="Main">
      <Link to="/" className="side-nav-brand" aria-label="BandScope Home">
        <span className="side-nav-brand-bar" />
        <span className="side-nav-brand-text">BandScope</span>
      </Link>
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `side-nav-link ${isActive ? 'active' : ''}`}
          end={to === '/'}
        >
          <span className="side-nav-icon" aria-hidden>{icon}</span>
          <span className="side-nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
