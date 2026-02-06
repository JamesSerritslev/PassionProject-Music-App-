import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/lib/supabase'
import { useLocationGeocode } from '@/hooks/useLocationGeocode'
import './ProfileSetup.css'

const GENRES = ['Rock', 'Indie', 'Jazz', 'Pop', 'Alternative', 'Funk', 'Electronic', 'Folk', 'Metal', 'Punk']
const INSTRUMENTS = ['Guitar', 'Bass', 'Drums', 'Keys', 'Vocals', 'Percussion', 'Saxophone', 'Trumpet', 'Violin', 'Other']

const STEPS = [
  { id: 1, title: 'About you' },
  { id: 2, title: 'Music preferences' },
  { id: 3, title: 'Finish up' },
]

export default function ProfileSetupPage() {
  const { user, profile, setProfile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const { geocode, geocoding, geocodeError, clearError } = useLocationGeocode()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<UserRole>('musician')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    display_name: '',
    location: '',
    latitude: null as number | null,
    longitude: null as number | null,
    bio: '',
    age: '' as string | number,
    genres: [] as string[],
    instruments: [] as string[],
    seeking: [] as string[],
    roles: [] as string[],
    influences: '',
    members: [] as { name: string; age?: number }[],
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
      setRole(profile.role)
    } else if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const r = (session?.user?.user_metadata?.role as UserRole) ?? 'musician'
        setRole(r)
      })
    }
  }, [profile])

  function toggleArray(arr: string[], item: string) {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
  }

  function canProceedStep1() {
    return form.display_name.trim().length > 0 && form.location.trim().length > 0
  }

  function canProceedStep2() {
    if (!isMusician && !isBand) return true
    return form.genres.length > 0 || form.instruments.length > 0 || form.seeking.length > 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setError('')
    setLoading(true)
    const displayName = form.display_name.trim() || 'Anonymous'
    const payload = {
      display_name: displayName,
      location: form.location.trim() || null,
      latitude: form.latitude ?? null,
      longitude: form.longitude ?? null,
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
      if (profile) {
        const { error: err } = await supabase.from('profiles').update(payload).eq('id', profile.id)
        if (err) {
          setError(err.message)
          setLoading(false)
          return
        }
      } else {
        const { error: err } = await supabase.from('profiles').insert({ user_id: user.id, role, ...payload })
        if (err) {
          setError(err.message)
          setLoading(false)
          return
        }
      }
      await refreshProfile()
    } else if (profile) {
      setProfile({ ...profile, ...payload, updated_at: new Date().toISOString() })
    }
    setLoading(false)
    navigate('/', { replace: true })
  }

  if (!user) return <Navigate to="/login" replace />

  const isBand = role === 'band'
  const isMusician = role === 'musician'

  return (
    <div className="profile-setup-page">
      <div className="profile-setup-card">
        <div className="ps-progress">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`ps-progress-step ${step >= s.id ? 'active' : ''} ${step === s.id ? 'current' : ''}`}
            >
              <span className="ps-progress-dot">{s.id}</span>
              <span className="ps-progress-label">{s.title}</span>
            </div>
          ))}
        </div>

        <h1 className="ps-title">
          {step === 1 && 'Tell us about yourself'}
          {step === 2 && 'What’s your music style?'}
          {step === 3 && 'Almost there'}
        </h1>
        <p className="profile-setup-sub">
          {step === 1 && `You're signing up as a ${role}. Let's start with the basics.`}
          {step === 2 && 'Select your genres, instruments, and what you’re looking for.'}
          {step === 3 && 'Add influences and any final details.'}
        </p>

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep((s) => s + 1) }} className="profile-setup-form">
          {error && <p className="auth-error">{error}</p>}

          {step === 1 && (
            <>
              <label className="ps-label">
                Display name *
                <input
                  type="text"
                  value={form.display_name}
                  onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
                  placeholder="Stage name or band name"
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
                    placeholder="Optional"
                    className="ps-input"
                  />
                </label>
              )}
            </>
          )}

          {step === 2 && (
            <>
              {(isMusician || isBand) ? (
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
                    Seeking (what you're looking for)
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
                </>
              ) : (
                <p className="ps-skip-msg">Venues can skip the music preferences step.</p>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <label className="ps-label">
                Influences
                <input
                  type="text"
                  value={form.influences}
                  onChange={(e) => setForm((f) => ({ ...f, influences: e.target.value }))}
                  placeholder="Artists or bands, comma separated"
                  className="ps-input"
                />
              </label>
              <label className="ps-label">
                Bio
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell people about yourself"
                  rows={3}
                  className="ps-input ps-textarea"
                />
              </label>
              {isMusician && (
                <label className="ps-label">
                  Roles (e.g. lead vocalist, rhythm guitar)
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
                  Members (names, comma separated)
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
            </>
          )}

          <div className="ps-actions">
            {step > 1 ? (
              <button type="button" className="ps-back" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <button
                type="submit"
                className="ps-next"
                disabled={(step === 1 && !canProceedStep1()) || (step === 2 && !canProceedStep2())}
              >
                Next
              </button>
            ) : (
              <button type="submit" disabled={loading} className="ps-submit">
                {loading ? 'Saving…' : 'Complete setup'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
