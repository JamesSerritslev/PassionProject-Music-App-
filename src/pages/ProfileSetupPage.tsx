import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { supabase, type Profile, type UserRole } from '@/lib/supabase'
import { useLocationGeocode } from '@/hooks/useLocationGeocode'
import './ProfileSetup.css'

const GENRES = ['Rock', 'Indie', 'Jazz', 'Pop', 'Alternative', 'Funk', 'Electronic', 'Folk', 'Metal', 'Punk']
const INSTRUMENTS = ['Guitar', 'Bass', 'Drums', 'Keys', 'Vocals', 'Percussion', 'Saxophone', 'Trumpet', 'Violin', 'Other']

const STEPS = [
  { id: 1, title: 'About you' },
  { id: 2, title: 'Music preferences' },
  { id: 3, title: 'Finish up' },
  { id: 4, title: 'Profile picture' },
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
    avatar_url: null as string | null,
    avatar_file: null as File | null,
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
        avatar_url: profile.avatar_url ?? null,
        avatar_file: null,
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
    const locationTrimmed = form.location?.trim()
    if (!locationTrimmed) {
      setError('Location is required.')
      return
    }
    setError('')
    setLoading(true)
    let avatarUrl = form.avatar_url
    if (supabase && form.avatar_file) {
      const ext = form.avatar_file.name.split('.').pop() || 'jpg'
      const path = `${user.id}/avatar.${ext}`
      let { error: uploadErr } = await supabase.storage.from('avatars').upload(path, form.avatar_file, { upsert: true })
      if (uploadErr) {
        const msg = (uploadErr.message || '').toLowerCase()
        const isBucketNotFound = msg.includes('bucket') || msg.includes('not found') || msg.includes('nosuchbucket') || msg.includes('404')
        if (isBucketNotFound) {
          await supabase.functions.invoke('ensure-avatars-bucket')
          const retry = await supabase.storage.from('avatars').upload(path, form.avatar_file, { upsert: true })
          uploadErr = retry.error
        }
      }
      if (uploadErr) {
        const isBucketProb = (uploadErr.message || '').toLowerCase().includes('bucket') ||
          (uploadErr.message || '').toLowerCase().includes('not found')
        setError(isBucketProb
          ? 'Storage bucket not set up. Create an "avatars" bucket in Supabase Dashboard (Storage → New bucket, public: true), or deploy the ensure-avatars-bucket Edge Function.'
          : uploadErr.message)
        setLoading(false)
        return
      }
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      avatarUrl = urlData.publicUrl
    }
    const displayName = form.display_name.trim() || 'Anonymous'
    const payload = {
      display_name: displayName,
      location: locationTrimmed,
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
      avatar_url: avatarUrl,
      last_active_at: new Date().toISOString(),
    }
    if (supabase) {
      let savedProfile: Profile | null = null
      if (profile) {
        const { data, error: err } = await supabase
          .from('profiles')
          .update(payload)
          .eq('id', profile.id)
          .select()
          .single()
        if (err) {
          setError(err.message)
          setLoading(false)
          return
        }
        savedProfile = data as Profile
      } else {
        const { data, error: err } = await supabase
          .from('profiles')
          .insert({ user_id: user.id, role, ...payload })
          .select()
          .single()
        if (err) {
          setError(err.message)
          setLoading(false)
          return
        }
        savedProfile = data as Profile
      }
      if (savedProfile) setProfile(savedProfile)
      else await refreshProfile()
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
          {step === 4 && 'Users with profile pictures are 20x more than users without!'}
        </p>

        <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); setStep((s) => s + 1) }} className="profile-setup-form">
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

          {step === 4 && (
            <>
              <div className="ps-avatar-upload">
                <div className="ps-avatar-preview">
                  {(form.avatar_file || form.avatar_url) ? (
                    <img
                      src={form.avatar_file ? URL.createObjectURL(form.avatar_file) : form.avatar_url!}
                      alt="Preview"
                      className="ps-avatar-img"
                    />
                  ) : (
                    <div className="ps-avatar-placeholder">
                      <span className="ps-avatar-icon">📷</span>
                      <span>No photo yet</span>
                    </div>
                  )}
                </div>
                <label className="ps-avatar-label">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setForm((f) => ({ ...f, avatar_file: file, avatar_url: null }))
                    }}
                    className="ps-avatar-input"
                  />
                  {form.avatar_file || form.avatar_url ? 'Change photo' : 'Add photo (optional)'}
                </label>
                {(form.avatar_file || form.avatar_url) && (
                  <button
                    type="button"
                    className="ps-avatar-remove"
                    onClick={() => setForm((f) => ({ ...f, avatar_file: null, avatar_url: null }))}
                  >
                    Remove
                  </button>
                )}
              </div>
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
            {step < 4 ? (
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
