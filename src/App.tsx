import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import SideNav from '@/components/BottomNav'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import ProfileSetupPage from '@/pages/ProfileSetupPage'
import HeroPage from '@/pages/HeroPage'
import ProfilePage from '@/pages/ProfilePage'
import ProfileViewPage from '@/pages/ProfileViewPage'
import EditProfilePage from '@/pages/EditProfilePage'
import EventsPage from '@/pages/EventsPage'
import EventDetailPage from '@/pages/EventDetailPage'
import CreateEventPage from '@/pages/CreateEventPage'
import MyEventsPage from '@/pages/MyEventsPage'
import MorePage from '@/pages/MorePage'
import SettingsPage from './pages/SettingsPage'

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return (
    <>
      <SideNav />
      <main className={!user ? 'has-auth-bar' : ''}>{children}</main>
    </>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()
  const [profileCheckDone, setProfileCheckDone] = useState(false)

  useEffect(() => {
    if (!user || profile !== null) {
      setProfileCheckDone(false)
      return
    }
    const t = setTimeout(() => setProfileCheckDone(true), 400)
    return () => clearTimeout(t)
  }, [user, profile])

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  const profileIncomplete = !profile || !profile.location?.trim()
  if (profileIncomplete) {
    if (profile === null && !profileCheckDone) {
      return (
        <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
        </div>
      )
    }
    return <Navigate to="/profile-setup" replace />
  }

  return <>{children}</>
}

function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (profile?.location?.trim()) {
    return <Navigate to="/" replace />
  }

  return <main>{children}</main>
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading…</div>
  if (user) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><SignupPage /></AuthRoute>} />
        <Route path="/forgot-password" element={<AuthRoute><div style={{ padding: 'var(--space-4)', textAlign: 'center' }}><h1>Forgot password</h1><p>Password reset will be available in Phase 2.</p></div></AuthRoute>} />

        <Route path="/profile-setup" element={
          <OnboardingLayout>
            <ProfileSetupPage />
          </OnboardingLayout>
        } />

        {/* Public browse routes — anyone can see these */}
        <Route path="/" element={<AppLayout><HeroPage /></AppLayout>} />
        <Route path="/events" element={<AppLayout><EventsPage /></AppLayout>} />
        <Route path="/events/:id" element={<AppLayout><EventDetailPage /></AppLayout>} />
        <Route path="/profile/:id" element={<AppLayout><ProfileViewPage /></AppLayout>} />

        {/* Protected routes — must be logged in with complete profile */}
        <Route path="/profile" element={<AppLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></AppLayout>} />
        <Route path="/profile/edit" element={<AppLayout><ProtectedRoute><EditProfilePage /></ProtectedRoute></AppLayout>} />
        <Route path="/profile/events" element={<AppLayout><ProtectedRoute><MyEventsPage /></ProtectedRoute></AppLayout>} />
        <Route path="/profile/events/new" element={<AppLayout><ProtectedRoute><CreateEventPage /></ProtectedRoute></AppLayout>} />
        <Route path="/events/new" element={<AppLayout><ProtectedRoute><CreateEventPage /></ProtectedRoute></AppLayout>} />
        <Route path="/more" element={<AppLayout><ProtectedRoute><MorePage /></ProtectedRoute></AppLayout>} />
        <Route path="/settings" element={<AppLayout><ProtectedRoute><SettingsPage /></ProtectedRoute></AppLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
