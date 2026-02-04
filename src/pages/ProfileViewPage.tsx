import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { MOCK_PROFILES, MOCK_FOLLOWING_IDS } from '@/data/mock'
import './ProfileViewPage.css'

const FEED_PROFILES = MOCK_PROFILES.filter((p) => p.role !== 'venue')

export default function ProfileViewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile: currentProfile } = useAuth()
  const [following, setFollowing] = useState(MOCK_FOLLOWING_IDS.has(id ?? ''))
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const profile = MOCK_PROFILES.find((p) => p.id === id) ?? null
  const isOwn = currentProfile?.id === id

  const { prevProfile, nextProfile } = useMemo(() => {
    const idx = FEED_PROFILES.findIndex((p) => p.id === id)
    if (idx < 0) return { prevProfile: null, nextProfile: null }
    const len = FEED_PROFILES.length
    return {
      prevProfile: FEED_PROFILES[(idx - 1 + len) % len],
      nextProfile: FEED_PROFILES[(idx + 1) % len],
    }
  }, [id])

  const allImages = profile
    ? [profile.avatar_url, ...(profile.gallery_urls ?? [])].filter((url): url is string => !!url)
    : []
  const lightboxImage = allImages[lightboxIndex] ?? null
  const hasMultiple = allImages.length > 1

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i <= 0 ? allImages.length - 1 : i - 1))
  }, [allImages.length])

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i >= allImages.length - 1 ? 0 : i + 1))
  }, [allImages.length])

  useEffect(() => {
    if (!lightboxOpen) return
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [lightboxOpen, closeLightbox, goPrev, goNext])

  useEffect(() => {
    if (lightboxOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevProfile) navigate(`/profile/${prevProfile.id}`)
      if (e.key === 'ArrowRight' && nextProfile) navigate(`/profile/${nextProfile.id}`)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxOpen, prevProfile, nextProfile, navigate])

  if (!profile) {
    return (
      <div className="profile-view-page">
        <p>Profile not found.</p>
        <Link to="/">Back to feed</Link>
      </div>
    )
  }

  const typeLabel = profile.role === 'band' ? 'Band' : profile.role === 'venue' ? 'Venue' : 'Musician'
  const instruments = profile.instruments?.join(', ') ?? '—'
  const seeking = profile.seeking?.join(', ') ?? '—'
  const genres = profile.genres?.join(', ') ?? '—'
  const galleryUrls = profile.gallery_urls ?? []

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
    <div className="profile-view-page">
      {FEED_PROFILES.length > 1 && (
        <>
          {prevProfile && (
            <Link
              to={`/profile/${prevProfile.id}`}
              className="profile-view-nav profile-view-nav-prev"
              aria-label={`Previous profile: ${prevProfile.display_name}`}
            >
              ‹
            </Link>
          )}
          {nextProfile && (
            <Link
              to={`/profile/${nextProfile.id}`}
              className="profile-view-nav profile-view-nav-next"
              aria-label={`Next profile: ${nextProfile.display_name}`}
            >
              ›
            </Link>
          )}
        </>
      )}
      <div className="profile-view-layout">
        
        <aside className="profile-view-images">
          <div
            className={`profile-view-main-image ${profile.avatar_url ? 'profile-view-image-clickable' : ''}`}
            role={profile.avatar_url ? 'button' : undefined}
            tabIndex={profile.avatar_url ? 0 : undefined}
            onClick={profile.avatar_url ? () => openLightbox(0) : undefined}
            onKeyDown={
              profile.avatar_url
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openLightbox(0)
                    }
                  }
                : undefined
            }
          >
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" />
            ) : (
              <span className="profile-view-initial">{profile.display_name[0]?.toUpperCase() ?? '?'}</span>
            )}
          </div>
          {galleryUrls.length > 0 && (
            <div className="profile-view-gallery">
              {galleryUrls.map((url, i) => (
                <div
                  key={i}
                  className="profile-view-gallery-item profile-view-image-clickable"
                  role="button"
                  tabIndex={0}
                  onClick={() => openLightbox(i + 1)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openLightbox(i + 1)
                    }
                  }}
                >
                  <img src={url} alt="" />
                </div>
              ))}
            </div>
          )}
        </aside>

        {lightboxOpen && lightboxImage && (
          <div
            className="profile-view-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            onClick={(e) => e.target === e.currentTarget && closeLightbox()}
          >
            <button
              type="button"
              className="profile-view-lightbox-close"
              onClick={closeLightbox}
              aria-label="Close"
            >
              ×
            </button>
            {hasMultiple && (
              <>
                <button
                  type="button"
                  className="profile-view-lightbox-prev"
                  onClick={(e) => {
                    e.stopPropagation()
                    goPrev()
                  }}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="profile-view-lightbox-next"
                  onClick={(e) => {
                    e.stopPropagation()
                    goNext()
                  }}
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}
            <div className="profile-view-lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img src={lightboxImage} alt="" />
            </div>
          </div>
        )}
        
        <main className="profile-view-content">
          <header className="profile-view-header">
            <h1 className="profile-view-name">{profile.display_name}</h1>
            <p className="profile-view-type">{typeLabel}</p>
            {profile.location && <p className="profile-view-location">{profile.location}</p>}
            {!isOwn && (
              <div className="profile-view-actions">
                <button
                  type="button"
                  className={`profile-view-btn ${following ? '' : 'primary'}`}
                  onClick={following ? handleUnfollow : handleFollow}
                >
                  {following ? 'Following' : 'Follow'}
                </button>
                <span className="profile-view-note">Message (coming soon)</span>
              </div>
            )}
          </header>

          <section className="profile-view-section">
            {profile.bio && (
              <div className="profile-view-block">
                <h2>Bio</h2>
                <p>{profile.bio}</p>
              </div>
            )}
            {(profile.role === 'musician' || profile.role === 'band') && (
              <>
                {profile.age !== undefined && profile.age !== null && profile.role === 'musician' && (
                  <div className="profile-view-block">
                    <h2>Age</h2>
                    <p>{profile.age}</p>
                  </div>
                )}
                <div className="profile-view-block">
                  <h2>Genres</h2>
                  <p>{genres}</p>
                </div>
                <div className="profile-view-block">
                  <h2>Instruments</h2>
                  <p>{instruments}</p>
                </div>
                <div className="profile-view-block">
                  <h2>Seeking</h2>
                  <p>{seeking}</p>
                </div>
                {profile.influences?.length ? (
                  <div className="profile-view-block">
                    <h2>Influences</h2>
                    <p>{profile.influences.join(', ')}</p>
                  </div>
                ) : null}
                {profile.role === 'band' && profile.members?.length ? (
                  <div className="profile-view-block">
                    <h2>Members</h2>
                    <p>{profile.members.map((m) => m.name + ((m.age ?? null) !== null ? ` (${m.age})` : '')).join(', ')}</p>
                  </div>
                ) : null}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
