import type { Profile } from '@/lib/supabase'
import './ProfileCard.css'

interface ProfileCardProps {
  profile: Profile
  featured?: boolean
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const instruments = profile.instruments?.join(', ') ?? '—'
  const genres = profile.genres?.join(', ') ?? '—'

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
          <li>{instruments}</li>
          {profile.location && <li>{profile.location}</li>}
          {genres !== '—' && <li>{genres}</li>}
        </ul>
      </div>
    </article>
  )
}
