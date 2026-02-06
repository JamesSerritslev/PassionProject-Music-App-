import { Link } from 'react-router-dom'
import './TopNav.css'

export default function TopNav() {
  return (
    <header className="top-nav" role="banner">
      <Link to="/" className="top-nav-brand" aria-label="BandScope Home">
        BandScope
      </Link>
    </header>
  )
}
