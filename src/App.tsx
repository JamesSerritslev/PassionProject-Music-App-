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
import SettingsPage from '@/pages/SettingsPage'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

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

  return (
    <>
      <SideNav />
      <main>{children}</main>
    </>
  )
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading…</div>
  if (user) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><div style={{ padding: 'var(--space-4)', textAlign: 'center' }}><h1>Forgot password</h1><p>Password reset will be available in Phase 2.</p></div></PublicRoute>} />

        <Route path="/profile-setup" element={
          <ProtectedLayout>
            <ProfileSetupPage />
          </ProtectedLayout>
        } />

        <Route path="/" element={<ProtectedLayout><HeroPage /></ProtectedLayout>} />
        <Route path="/profile" element={<ProtectedLayout><ProfilePage /></ProtectedLayout>} />
        <Route path="/profile/edit" element={<ProtectedLayout><EditProfilePage /></ProtectedLayout>} />
        <Route path="/profile/events" element={<ProtectedLayout><MyEventsPage /></ProtectedLayout>} />
        <Route path="/profile/events/new" element={<ProtectedLayout><CreateEventPage /></ProtectedLayout>} />
        <Route path="/profile/:id" element={<ProtectedLayout><ProfileViewPage /></ProtectedLayout>} />

        <Route path="/events" element={<ProtectedLayout><EventsPage /></ProtectedLayout>} />
        <Route path="/events/:id" element={<ProtectedLayout><EventDetailPage /></ProtectedLayout>} />
        <Route path="/events/new" element={<ProtectedLayout><CreateEventPage /></ProtectedLayout>} />

        <Route path="/more" element={<ProtectedLayout><MorePage /></ProtectedLayout>} />
        <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
