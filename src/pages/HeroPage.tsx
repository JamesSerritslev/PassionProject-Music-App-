import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ProfileCard from '@/components/ProfileCard'
import { useProfiles } from '@/hooks/useProfiles'
import { useLocationGeocode } from '@/hooks/useLocationGeocode'
import { distanceMiles } from '@/lib/geocoding'
import './HeroPage.css'

const RADIUS_OPTIONS = [10, 25, 50, 100, 250]

export default function HeroPage() {
  const { profiles: allProfiles, loading: profilesLoading } = useProfiles()
  const [search, setSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchLocation, setSearchLocation] = useState('')
  const [radiusIndex, setRadiusIndex] = useState(2)
  const radius = RADIUS_OPTIONS[radiusIndex]
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number } | null>(null)
  const { geocode, geocoding, geocodeError, clearError } = useLocationGeocode()

  const handleApplyFilters = useCallback(async () => {
    clearError()
    if (!searchLocation.trim()) {
      setSearchCenter(null)
      setFiltersOpen(false)
      return
    }
    const coords = await geocode(searchLocation.trim())
    if (coords) {
      setSearchCenter(coords)
      setFiltersOpen(false)
    }
  }, [searchLocation, geocode, clearError])

  const profiles = useMemo(() => {
    let list = allProfiles
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.display_name.toLowerCase().includes(q) ||
          (p.location?.toLowerCase().includes(q) ?? false)
      )
    }
    if (searchCenter) {
      list = list.filter((p) => {
        if (p.latitude == null || p.longitude == null) return false
        const dist = distanceMiles(searchCenter.lat, searchCenter.lng, p.latitude, p.longitude)
        return dist <= radius
      })
    }
    return list
  }, [allProfiles, search, searchCenter, radius])

  useEffect(() => {
    if (!filtersOpen) return
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFiltersOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [filtersOpen])

  return (
    <div className="hero-page">
      <header className="hero-header">
        <div className="hero-header-top">
          <div className="hero-search-wrap">
            <span className="hero-search-icon" aria-hidden>🔍</span>
            <input
              type="search"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="hero-search"
              aria-label="Search profiles"
            />
          </div>
          <button
            type="button"
            className="hero-filters-btn"
            onClick={() => setFiltersOpen(true)}
            aria-label="Search filters"
          >
            Filters
          </button>
        </div>
        <h1 className="hero-heading">Discover musicians and bands</h1>
      </header>

      <section className="hero-feed">
        {profilesLoading ? (
          <p className="hero-empty">Loading profiles…</p>
        ) : profiles.length === 0 ? (
          <p className="hero-empty">No profiles found. Try a different search.</p>
        ) : (
          <ul className="hero-card-list">
            {profiles.map((p) => (
              <li key={p.id}>
                <Link to={`/profile/${p.id}`} className="hero-card-link">
                  <ProfileCard profile={p} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {filtersOpen && (
        <div
          className="hero-filters-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="hero-filters-title"
          onClick={(e) => e.target === e.currentTarget && setFiltersOpen(false)}
        >
          <div className="hero-filters-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hero-filters-header">
              <h2 id="hero-filters-title">Search Filters</h2>
              <button
                type="button"
                className="hero-filters-close"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="hero-filters-body">
              <label className="hero-filters-label">
                Search Location
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => {
                    clearError()
                    setSearchLocation(e.target.value)
                  }}
                  placeholder="City, State or address"
                  className="hero-filters-input"
                />
                {geocodeError && <span className="hero-filters-error">{geocodeError}</span>}
              </label>
              <label className="hero-filters-label">
                Radius: {radius} miles
                <div className="hero-filters-slider-wrap">
                  <input
                    type="range"
                    min={0}
                    max={RADIUS_OPTIONS.length - 1}
                    step={1}
                    value={radiusIndex}
                    onChange={(e) => setRadiusIndex(Number(e.target.value))}
                    className="hero-filters-slider"
                  />
                  <div className="hero-filters-slider-marks">
                    {RADIUS_OPTIONS.map((r: number, i: number) => (
                      <span
                        key={r}
                        className={`hero-filters-mark ${i === radiusIndex ? 'active' : ''}`}
                        style={{ left: `${(i / (RADIUS_OPTIONS.length - 1)) * 100}%` }}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </label>
            </div>
            <div className="hero-filters-footer">
              <button
                type="button"
                className="hero-filters-apply"
                onClick={handleApplyFilters}
                disabled={geocoding}
              >
                {geocoding ? 'Finding location…' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
