import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useLocationGeocode } from '@/hooks/useLocationGeocode'
import './ProfileSetup.css'

const GENRES = [
  'Acoustic', 'Alternative', 'Americana', 'Bluegrass', 'Blues', 'Calypso', 'Celtic',
  'Christian / Gospel', 'Christian Contemporary', 'Classic Rock', 'Classical', 'Country',
  'Cover/Tribute', 'Dubstep', 'Electronic', 'Folk', 'Funk', 'Hip Hop/Rap', 'Jazz', 'Latin',
  'Lounge', 'Metal', 'Pop', 'Progressive', 'Punk', 'R&B', 'Reggae', 'Rock', 'Ska',
  'Southern Rock', 'World', 'Other',
]
const INSTRUMENTS = [
  'Vocalist', 'Lead Guitar', 'Rhythm Guitar', 'Acoustic Guitar', 'Bass Guitar', 'Drums',
  'Keyboard', 'Piano', 'DJ', 'Electronic Music', 'Background Singer',
  'Vocalist - Tenor', 'Vocalist - Baritone', 'Vocalist - Alto', 'Vocalist - Soprano', 'Vocalist - Bass',
  'Saxophone', 'Trumpet', 'Violin', 'Fiddle', 'Cello', 'Flute', 'Harmonica',
  'Banjo', 'Mandolin', 'Ukulele', 'Upright bass', 'Dobro', 'Steel guitar',
  'Trombone', 'Clarinet', 'Harp', 'Accordion', 'Bagpipes',
  'Other Percussion', 'Other',
]
const SEEKING = [
  'Vocalist', 'Lead Guitar', 'Rhythm Guitar', 'Acoustic Guitar', 'Bass Guitar', 'Drums',
  'Keyboard', 'Piano', 'DJ', 'Electronic Music', 'Background Singer',
  'Vocalist - Tenor', 'Vocalist - Baritone', 'Vocalist - Alto', 'Vocalist - Soprano', 'Vocalist - Bass',
  'Saxophone', 'Trumpet', 'Violin', 'Fiddle', 'Cello', 'Flute', 'Harmonica',
  'Banjo', 'Mandolin', 'Ukulele', 'Upright bass', 'Dobro', 'Steel guitar',
  'Trombone', 'Clarinet', 'Harp', 'Accordion', 'Bagpipes',
  'Other Percussion', 'Any', 'Other',
]

export default function EditProfilePage() {
  const { profile, setProfile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { geocode, geocoding, geocodeError, clearError } = useLocationGeocode()

  const [showAllGenres, setShowAllGenres] = useState(false)
  const [showAllInstruments, setShowAllInstruments] = useState(false)
  const [showAllSeeking, setShowAllSeeking] = useState(false)
  const [form, setForm] = useState({
    display_name: profile?.display_name ?? '',
    location: profile?.location ?? '',
    latitude: profile?.latitude ?? null as number | null,
    longitude: profile?.longitude ?? null as number | null,
    bio: profile?.bio ?? '',
    age: profile?.age ?? '',
    genres: profile?.genres ?? [] as string[],
    instruments: profile?.instruments ?? [] as string[],
    seeking: profile?.seeking ?? [] as string[],
    roles: profile?.roles ?? [] as string[],
    influences: (profile?.influences ?? []).join(', '),
    members: profile?.members ?? [] as { name: string; age?: number }[],
  })

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name ?? '',
        location: profile.location ?? '',
        latitude: profile.latitude ?? null,
        longitude: profile.longitude ?? null,
        bio: profile.bio ?? '',
        age: profile.age ?? '',
        genres: profile.genres ?? [],
        instruments: profile.instruments ?? [],
        seeking: profile.seeking ?? [],
        roles: profile.roles ?? [],
        influences: (profile.influences ?? []).join(', '),
        members: profile.members ?? [],
      })
    }
  }, [profile])

  function toggleArray(arr: string[], item: string) {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setError('')
    setLoading(true)
    try {
      let lat = form.latitude
      let lng = form.longitude
      if (form.location.trim() && (lat === null || lng === null)) {
        const coords = await geocode(form.location.trim())
        if (coords) {
          lat = coords.lat
          lng = coords.lng
        }
      }
      const payload = {
        display_name: form.display_name.trim() || 'Anonymous',
        location: form.location.trim() || null,
        latitude: lat,
        longitude: lng,
        bio: form.bio.trim() || null,
        age: form.age ? Number(form.age) : null,
        genres: form.genres.length ? form.genres : [],
        instruments: form.instruments.length ? form.instruments : [],
        seeking: form.seeking.length ? form.seeking : [],
        roles: form.roles.length ? form.roles : [],
        influences: form.influences.trim() ? form.influences.split(',').map((s) => s.trim()).filter(Boolean) : [],
        members: form.members.length ? form.members : [],
        last_active_at: new Date().toISOString(),
      }
      if (supabase) {
        const { error: err } = await supabase.from('profiles').update(payload).eq('id', profile.id)
        if (err) {
          setError(err.message)
          return
        }
        setProfile({ ...profile, ...payload, updated_at: new Date().toISOString() })
        refreshProfile()
      } else {
        setProfile({ ...profile, ...payload, updated_at: new Date().toISOString() })
      }
      navigate('/profile', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  const isBand = profile?.role === 'band'
  const isMusician = profile?.role === 'musician'

  return (
    <div className="profile-setup-page">
      <div className="profile-setup-card">
        <h1>Edit profile</h1>

        <form onSubmit={handleSubmit} className="profile-setup-form">
          {error && <p className="auth-error">{error}</p>}
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
              onChange={(e) => {
                clearError()
                setForm((f) => ({ ...f, location: e.target.value, latitude: null, longitude: null }))
              }}
              onBlur={async () => {
                if (form.location.trim()) {
                  const coords = await geocode(form.location.trim())
                  if (coords) setForm((f) => ({ ...f, latitude: coords.lat, longitude: coords.lng }))
                }
              }}
              placeholder="City, State or full address"
              required
              className="ps-input"
            />
            {geocoding && <span className="ps-hint">Finding coordinates…</span>}
            {geocodeError && <span className="ps-hint ps-hint-error">{geocodeError}</span>}
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
                <div className={`ps-chips ${showAllGenres ? '' : 'ps-chips-collapsed'}`}>
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
                {GENRES.length > 12 && (
                  <button type="button" className="ps-show-more" onClick={() => setShowAllGenres((v) => !v)}>
                    {showAllGenres ? 'Show less' : `Show more (${GENRES.length - 12})`}
                  </button>
                )}
              </div>
              {isMusician && (
                <div className="ps-label">
                  Instruments
                  <div className={`ps-chips ${showAllInstruments ? '' : 'ps-chips-collapsed'}`}>
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
                  {INSTRUMENTS.length > 12 && (
                    <button type="button" className="ps-show-more" onClick={() => setShowAllInstruments((v) => !v)}>
                      {showAllInstruments ? 'Show less' : `Show more (${INSTRUMENTS.length - 12})`}
                    </button>
                  )}
                </div>
              )}
              <div className="ps-label">
                Seeking
                <div className={`ps-chips ${showAllSeeking ? '' : 'ps-chips-collapsed'}`}>
                  {SEEKING.map((i) => (
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
                {SEEKING.length > 12 && (
                  <button type="button" className="ps-show-more" onClick={() => setShowAllSeeking((v) => !v)}>
                    {showAllSeeking ? 'Show less' : `Show more (${SEEKING.length - 12})`}
                  </button>
                )}
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
          <button type="submit" disabled={loading} className="ps-submit">
            {loading ? 'Saving…' : 'Save changes'}
          </button>
          <button type="button" className="ps-cancel" onClick={() => navigate('/profile')}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}
