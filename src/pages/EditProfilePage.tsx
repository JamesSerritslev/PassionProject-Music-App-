import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { Profile } from '@/lib/supabase'
import './ProfileSetup.css'

const GENRES = ['Rock', 'Indie', 'Jazz', 'Pop', 'Alternative', 'Funk', 'Electronic', 'Folk', 'Metal', 'Punk']
const INSTRUMENTS = ['Guitar', 'Bass', 'Drums', 'Keys', 'Vocals', 'Percussion', 'Saxophone', 'Trumpet', 'Violin', 'Other']

export default function EditProfilePage() {
  const { profile, setProfile } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    display_name: profile?.display_name ?? '',
    location: profile?.location ?? '',
    bio: profile?.bio ?? '',
    age: profile?.age ?? '',
    genres: profile?.genres ?? [] as string[],
    instruments: profile?.instruments ?? [] as string[],
    seeking: profile?.seeking ?? [] as string[],
    roles: profile?.roles ?? [] as string[],
    influences: (profile?.influences ?? []).join(', '),
    members: profile?.members ?? [] as { name: string; age?: number }[],
  })

  function toggleArray(arr: string[], item: string) {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    const updated: Profile = {
      ...profile,
      display_name: form.display_name.trim() || 'Anonymous',
      location: form.location.trim() || null,
      bio: form.bio.trim() || null,
      age: form.age ? Number(form.age) : null,
      genres: form.genres.length ? form.genres : null,
      instruments: form.instruments.length ? form.instruments : null,
      seeking: form.seeking.length ? form.seeking : null,
      roles: form.roles.length ? form.roles : null,
      influences: form.influences.trim() ? form.influences.split(',').map((s) => s.trim()).filter(Boolean) : null,
      members: form.members.length ? form.members : null,
      updated_at: new Date().toISOString(),
    }
    setProfile(updated)
    navigate('/profile', { replace: true })
  }

  const isBand = profile?.role === 'band'
  const isMusician = profile?.role === 'musician'

  return (
    <div className="profile-setup-page">
      <div className="profile-setup-card">
        <h1>Edit profile</h1>

        <form onSubmit={handleSubmit} className="profile-setup-form">
          <label className="ps-label">
            Display name *
            <input
              type="text"
              value={form.display_name}
              onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
              required
              className="ps-input"
            />
          </label>
          <label className="ps-label">
            Location *
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              required
              className="ps-input"
            />
          </label>
          {isMusician && (
            <label className="ps-label">
              Age
              <input
                type="number"
                min={13}
                max={120}
                value={form.age || ''}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                className="ps-input"
              />
            </label>
          )}
          <label className="ps-label">
            Bio
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={3}
              className="ps-input ps-textarea"
            />
          </label>
          {(isMusician || isBand) && (
            <>
              <div className="ps-label">
                Genres
                <div className="ps-chips">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`ps-chip ${form.genres.includes(g) ? 'active' : ''}`}
                      onClick={() => setForm((f) => ({ ...f, genres: toggleArray(f.genres, g) }))}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              {isMusician && (
                <div className="ps-label">
                  Instruments
                  <div className="ps-chips">
                    {INSTRUMENTS.map((i) => (
                      <button
                        key={i}
                        type="button"
                        className={`ps-chip ${form.instruments.includes(i) ? 'active' : ''}`}
                        onClick={() => setForm((f) => ({ ...f, instruments: toggleArray(f.instruments, i) }))}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="ps-label">
                Seeking
                <div className="ps-chips">
                  {INSTRUMENTS.map((i) => (
                    <button
                      key={i}
                      type="button"
                      className={`ps-chip ${form.seeking.includes(i) ? 'active' : ''}`}
                      onClick={() => setForm((f) => ({ ...f, seeking: toggleArray(f.seeking, i) }))}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              {isMusician && (
                <label className="ps-label">
                  Roles
                  <input
                    type="text"
                    value={form.roles.join(', ')}
                    onChange={(e) => setForm((f) => ({ ...f, roles: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
                    placeholder="Comma separated"
                    className="ps-input"
                  />
                </label>
              )}
              {isBand && (
                <label className="ps-label">
                  Members
                  <input
                    type="text"
                    value={form.members.map((m) => m.name + (m.age ? ` (${m.age})` : '')).join(', ')}
                    onChange={(e) => {
                      const parts = e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      setForm((f) => ({
                        ...f,
                        members: parts.map((p) => {
                          const ageMatch = p.match(/\((\d+)\)$/)
                          return ageMatch ? { name: p.replace(/\s*\(\d+\)$/, ''), age: Number(ageMatch[1]) } : { name: p }
                        }),
                      }))
                    }}
                    placeholder="Jake (26), Mia (24)"
                    className="ps-input"
                  />
                </label>
              )}
              <label className="ps-label">
                Influences
                <input
                  type="text"
                  value={form.influences}
                  onChange={(e) => setForm((f) => ({ ...f, influences: e.target.value }))}
                  placeholder="Comma separated"
                  className="ps-input"
                />
              </label>
            </>
          )}
          <button type="submit" className="ps-submit">Save changes</button>
          <button type="button" className="ps-cancel" onClick={() => navigate('/profile')}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}
