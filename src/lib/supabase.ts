import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing. Using mock mode for development.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type UserRole = 'musician' | 'band' | 'venue'

export interface Profile {
  id: string
  user_id: string
  role: UserRole
  display_name: string
  avatar_url: string | null
  gallery_urls: string[] | null
  location: string | null
  bio: string | null
  links: string[] | null
  genres: string[] | null
  instruments: string[] | null
  seeking: string[] | null
  influences: string[] | null
  age: number | null
  roles: string[] | null
  members: { name: string; age?: number }[] | null
  last_active_at: string | null
  created_at: string
  updated_at: string
}

export interface EventRow {
  id: string
  created_by: string
  name: string
  description: string | null
  location: string | null
  event_date: string
  event_time: string | null
  price: string | null
  image_url: string | null
  attendee_count: number
  created_at: string
  updated_at: string
}

export interface FollowRow {
  follower_id: string
  following_id: string
  created_at: string
}
