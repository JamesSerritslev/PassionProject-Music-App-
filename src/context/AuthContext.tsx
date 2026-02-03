import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile, UserRole } from '@/lib/supabase'

interface AuthUser {
  id: string
  email: string
}

interface AuthState {
  user: AuthUser | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, role?: UserRole) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  setProfile: (profile: Profile | null) => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

// Mock profile for demo when Supabase not configured
const MOCK_PROFILE: Profile = {
  id: 'mock-profile',
  user_id: 'mock-user',
  role: 'musician',
  display_name: 'Demo User',
  avatar_url: null,
  location: 'New York, NY',
  bio: 'Edit your profile to add a bio.',
  links: null,
  genres: ['Rock'],
  instruments: ['Guitar'],
  seeking: ['Drummer'],
  influences: null,
  age: 25,
  roles: ['Guitarist'],
  members: null,
  last_active_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfileState] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return MOCK_PROFILE
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    return (data as Profile) ?? null
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    const p = await fetchProfile(user.id)
    setProfileState(p)
  }, [user, fetchProfile])

  const setProfile = useCallback((p: Profile | null) => setProfileState(p), [])

  useEffect(() => {
    if (!supabase) {
      // Auto sign-in for demo when Supabase not configured
      setUser({ id: 'mock-user', email: 'demo@bandscope.app' })
      setProfileState(MOCK_PROFILE)
      setLoading(false)
      return
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? '' })
        const p = await fetchProfile(session.user.id)
        setProfileState(p)
      } else {
        setUser(null)
        setProfileState(null)
      }
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      // Mock sign-in for demo
      setUser({ id: 'mock-user', email })
      setProfileState(MOCK_PROFILE)
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signUp = useCallback(async (email: string, password: string, role: UserRole = 'musician') => {
    if (!supabase) {
      setUser({ id: 'mock-user', email })
      setProfileState({ ...MOCK_PROFILE, display_name: email.split('@')[0], role })
      return { error: null }
    }
    const { error } = await supabase.auth.signUp({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setProfileState(null)
  }, [])

  const value: AuthState = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    setProfile,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
