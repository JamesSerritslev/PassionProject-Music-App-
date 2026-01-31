import { Link } from 'react-router-dom'
import './MorePage.css'

export default function SettingsPage() {
  return (
    <div className="more-page">
      <header className="more-header">
        <Link to="/more" className="settings-back">← Back</Link>
        <h1>Settings</h1>
        <p className="more-email">Notification and account settings (MVP: coming soon)</p>
      </header>

      <nav className="more-nav">
        <span className="more-link disabled">Notification settings (Phase 2)</span>
        <span className="more-link disabled">Password reset (Phase 2)</span>
        <span className="more-link disabled">Account settings (Phase 2)</span>
      </nav>
    </div>
  )
}
