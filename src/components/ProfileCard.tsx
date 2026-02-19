import type { Profile } from '@/lib/supabase'
import './ProfileCard.css'

interface ProfileCardProps {
  profile: Profile
  featured?: boolean
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const instruments = profile.instruments?.length ? profile.instruments.join(', ') : null
  const seeking = profile.seeking?.length ? profile.seeking.join(', ') : null

  return (
    <article className="profile-card">
      <div className="profile-card-image">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="" />
        ) : (
          <span className="profile-card-initial">{profile.display_name[0]?.toUpperCase() ?? '?'}</span>
        )}
      </div>
      <div className="profile-card-body">
        <h2 className="profile-card-name">{profile.display_name}</h2>
        <ul className="profile-card-details">
          {profile.location && <li>{profile.location}</li>}
          {instruments && <li><strong>Plays</strong> {instruments}</li>}
          {seeking && <li><strong>Seeking</strong> {seeking}</li>}
        </ul>
      </div>
    </article>
  )
}
