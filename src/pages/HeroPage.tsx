import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MOCK_PROFILES } from '@/data/mock'
import ProfileCard from '@/components/ProfileCard'
import './HeroPage.css'

export default function HeroPage() {
  const [search, setSearch] = useState('')

  // In MVP use mock data; later replace with Supabase query (exclude venues from feed per spec)
  const profiles = useMemo(() => {
    let list = MOCK_PROFILES.filter((p) => p.role !== 'venue')
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.display_name.toLowerCase().includes(q) ||
          (p.location?.toLowerCase().includes(q) ?? false)
      )
    }
    return list
  }, [search])

  return (
    <div className="hero-page">
      <header className="hero-header">
        <h1 className="hero-title">BandScope</h1>
        <div className="hero-search-wrap">
          <input
            type="search"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="hero-search"
            aria-label="Search profiles"
          />
          <span className="hero-search-icon" aria-hidden>🔍</span>
        </div>
        <p className="hero-sub">Discover musicians and bands</p>
      </header>

      <section className="hero-feed">
        {profiles.length === 0 ? (
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
    </div>
  )
}
