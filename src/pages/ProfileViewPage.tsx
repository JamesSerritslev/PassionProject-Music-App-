import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { MOCK_PROFILES, MOCK_FOLLOWING_IDS } from '@/data/mock'
import './ProfilePage.css'

export default function ProfileViewPage() {
  const { id } = useParams<{ id: string }>()
  const { profile: currentProfile } = useAuth()
  const [following, setFollowing] = useState(MOCK_FOLLOWING_IDS.has(id ?? ''))

  const profile = MOCK_PROFILES.find((p) => p.id === id) ?? null
  const isOwn = currentProfile?.id === id

  if (!profile) {
    return (
      <div className="profile-page">
        <p>Profile not found.</p>
        <Link to="/">Back to feed</Link>
      </div>
    )
  }

  const typeLabel = profile.role === 'band' ? 'Band' : profile.role === 'venue' ? 'Venue' : 'Musician'
  const instruments = profile.instruments?.join(', ') ?? '—'
  const seeking = profile.seeking?.join(', ') ?? '—'
  const genres = profile.genres?.join(', ') ?? '—'

  function handleFollow() {
    if (id) {
      MOCK_FOLLOWING_IDS.add(id)
      setFollowing(true)
    }
  }

  function handleUnfollow() {
    if (id) {
      MOCK_FOLLOWING_IDS.delete(id)
      setFollowing(false)
    }
  }

  return (
    <div className="profile-page">
      <header className="profile-page-header">
        <Link to="/" className="profile-page-back">← Back</Link>
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
        {!isOwn && (
          <div className="profile-page-actions">
            <button
              type="button"
              className={`profile-page-btn ${following ? '' : 'primary'}`}
              onClick={following ? handleUnfollow : handleFollow}
            >
              {following ? 'Following' : 'Follow'}
            </button>
            <span className="profile-page-note">Message (coming soon)</span>
          </div>
        )}
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
      </section>
    </div>
  )
}
