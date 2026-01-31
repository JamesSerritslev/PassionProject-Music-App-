import { NavLink } from 'react-router-dom'
import './BottomNav.css'

const navItems = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/events', label: 'Events', icon: '📅' },
  { to: '/profile', label: 'Profile', icon: '👤' },
  { to: '/more', label: 'More', icon: '⋯' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main">
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}
          end={to === '/'}
        >
          <span className="bottom-nav-icon" aria-hidden>{icon}</span>
          <span className="bottom-nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
