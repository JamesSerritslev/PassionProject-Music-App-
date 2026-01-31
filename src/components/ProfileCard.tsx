import type { Profile } from '@/lib/supabase'
import './ProfileCard.css'

interface ProfileCardProps {
  profile: Profile
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const typeLabel = profile.role === 'band' ? 'Band' : 'Musician'
  const instruments = profile.instruments?.join(', ') ?? '—'
  const seeking = profile.seeking?.join(', ') ?? '—'

  return (
    <article className="profile-card">
      <div className="profile-card-avatar">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="" />
        ) : (
          <span className="profile-card-initial">{profile.display_name[0]?.toUpperCase() ?? '?'}</span>
        )}
      </div>
      <div className="profile-card-body">
        <h2 className="profile-card-name">{profile.display_name}</h2>
        <div className="profile-card-meta">
          {profile.age !== undefined && profile.age !== null && <span>{profile.age}</span>}
          <span className="profile-card-type">{typeLabel}</span>
        </div>
        {profile.location && <p className="profile-card-location">{profile.location}</p>}
        <p className="profile-card-detail"><strong>Instruments:</strong> {instruments}</p>
        <p className="profile-card-detail"><strong>Seeking:</strong> {seeking}</p>
      </div>
    </article>
  )
}
