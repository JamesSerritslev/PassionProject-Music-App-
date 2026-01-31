import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import './ProfilePage.css'

export default function ProfilePage() {
  const { profile } = useAuth()

  if (!profile) return null

  const typeLabel = profile.role === 'band' ? 'Band' : profile.role === 'venue' ? 'Venue' : 'Musician'
  const instruments = profile.instruments?.join(', ') ?? '—'
  const seeking = profile.seeking?.join(', ') ?? '—'
  const genres = profile.genres?.join(', ') ?? '—'

  return (
    <div className="profile-page">
      <header className="profile-page-header">
        <div className="profile-page-avatar">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" />
          ) : (
            <span className="profile-page-initial">{profile.display_name[0]?.toUpperCase() ?? '?'}</span>
          )}
        </div>
        <h1 className="profile-page-name">{profile.display_name}</h1>
        <p className="profile-page-type">{typeLabel}</p>
        {profile.location && <p className="profile-page-location">{profile.location}</p>}
        <div className="profile-page-actions">
          <Link to="/profile/edit" className="profile-page-btn primary">Edit Profile</Link>
          <Link to="/settings" className="profile-page-btn">Settings</Link>
        </div>
      </header>

      <section className="profile-page-section">
        {profile.bio && (
          <div className="profile-page-block">
            <h2>Bio</h2>
            <p>{profile.bio}</p>
          </div>
        )}
        {(profile.role === 'musician' || profile.role === 'band') && (
          <>
            {profile.age !== undefined && profile.age !== null && profile.role === 'musician' && (
              <div className="profile-page-block">
                <h2>Age</h2>
                <p>{profile.age}</p>
              </div>
            )}
            <div className="profile-page-block">
              <h2>Genres</h2>
              <p>{genres}</p>
            </div>
            <div className="profile-page-block">
              <h2>Instruments</h2>
              <p>{instruments}</p>
            </div>
            <div className="profile-page-block">
              <h2>Seeking</h2>
              <p>{seeking}</p>
            </div>
            {profile.influences?.length ? (
              <div className="profile-page-block">
                <h2>Influences</h2>
                <p>{profile.influences.join(', ')}</p>
              </div>
            ) : null}
            {profile.role === 'band' && profile.members?.length ? (
              <div className="profile-page-block">
                <h2>Members</h2>
                <p>{profile.members.map((m) => m.name + ((m.age ?? null) !== null ? ` (${m.age})` : '')).join(', ')}</p>
              </div>
            ) : null}
          </>
        )}
        {(profile.role === 'band' || profile.role === 'venue') && (
          <div className="profile-page-block">
            <h2>Events</h2>
            <Link to="/profile/events" className="profile-page-link">View my events →</Link>
            <Link to="/profile/events/new" className="profile-page-btn primary" style={{ marginTop: 'var(--space-2)' }}>Create New Event</Link>
          </div>
        )}
      </section>
    </div>
  )
}
