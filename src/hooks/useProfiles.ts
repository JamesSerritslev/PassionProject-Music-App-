import { useState, useEffect, useCallback } from 'react'
import type { Profile } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { MOCK_PROFILES } from '@/data/mock'

function normalizeProfile(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id ?? ''),
    user_id: String(row.user_id ?? ''),
    role: (row.role as Profile['role']) ?? 'musician',
    display_name: String(row.display_name ?? ''),
    avatar_url: row.avatar_url != null ? String(row.avatar_url) : null,
    gallery_urls: Array.isArray(row.gallery_urls) ? row.gallery_urls.filter((x): x is string => typeof x === 'string') : null,
    location: row.location != null ? String(row.location) : null,
    latitude: typeof row.latitude === 'number' ? row.latitude : null,
    longitude: typeof row.longitude === 'number' ? row.longitude : null,
    bio: row.bio != null ? String(row.bio) : null,
    links: Array.isArray(row.links) ? row.links.filter((x): x is string => typeof x === 'string') : null,
    genres: Array.isArray(row.genres) ? row.genres.filter((x): x is string => typeof x === 'string') : null,
    instruments: Array.isArray(row.instruments) ? row.instruments.filter((x): x is string => typeof x === 'string') : null,
    seeking: Array.isArray(row.seeking) ? row.seeking.filter((x): x is string => typeof x === 'string') : null,
    influences: Array.isArray(row.influences) ? row.influences.filter((x): x is string => typeof x === 'string') : null,
    age: typeof row.age === 'number' ? row.age : null,
    roles: Array.isArray(row.roles) ? row.roles.filter((x): x is string => typeof x === 'string') : null,
    members: Array.isArray(row.members)
      ? (row.members as { name: string; age?: number }[]).filter((m) => m && typeof m.name === 'string')
      : null,
    last_active_at: row.last_active_at != null ? String(row.last_active_at) : null,
    created_at: String(row.created_at ?? new Date().toISOString()),
    updated_at: String(row.updated_at ?? new Date().toISOString()),
  }
}

/**
 * Fetches profiles from Supabase and merges with mock data for testing.
 * Excludes venues per spec. Real profiles appear first, then mock.
 */
export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>(() =>
    MOCK_PROFILES.filter((p) => p.role !== 'venue')
  )
  const [loading, setLoading] = useState(!!supabase)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!supabase) {
      setProfiles(MOCK_PROFILES.filter((p) => p.role !== 'venue'))
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'venue')
      if (err) {
        setError(err.message)
        setProfiles(MOCK_PROFILES.filter((p) => p.role !== 'venue'))
        return
      }
      const real = (data ?? []).map((row) => normalizeProfile(row as Record<string, unknown>))
      const mock = MOCK_PROFILES.filter((p) => p.role !== 'venue')
      setProfiles([...real, ...mock])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load profiles')
      setProfiles(MOCK_PROFILES.filter((p) => p.role !== 'venue'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { profiles, loading, error, refresh }
}
