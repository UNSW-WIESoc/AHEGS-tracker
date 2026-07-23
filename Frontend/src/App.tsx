import { useState } from 'react'
import type { Page, User, Evidence } from './types'
import { MOCK_USERS, MOCK_EVIDENCE } from './data'
import LoginPage from './components/auth/LoginPage'
import RegisterPage from './components/auth/RegisterPage'
import ForgotPasswordPage from './components/auth/ForgotPasswordPage'
import UserDashboard from './components/dashboard/UserDashboard'
import AdminDashboard from './components/dashboard/AdminDashboard'
import ProfilePage from './components/profile/ProfilePage'

export default function App() {
  const [page, setPage] = useState<Page>('login')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [evidence, setEvidence] = useState<Evidence[]>(MOCK_EVIDENCE)

  const navigate = (p: Page) => setPage(p)

  const handleLogin = (email: string, _password: string) => {
    const user = MOCK_USERS.find((u) => u.email === email)
    if (user) {
      setCurrentUser(user)
      setPage(user.role === 'admin' ? 'admin' : 'dashboard')
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setPage('login')
  }

  if (!currentUser) {
    if (page === 'register') return <RegisterPage onLogin={() => navigate('login')} onNavigate={navigate} />
    if (page === 'forgot-password') return <ForgotPasswordPage onNavigate={navigate} />
    return <LoginPage onLogin={handleLogin} onNavigate={navigate} />
  }

  if (page === 'profile') {
    return (
      <ProfilePage
        user={currentUser}
        onUpdateUser={(u) => setCurrentUser(u)}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

  if (currentUser.role === 'admin') {
    return (
      <AdminDashboard
        user={currentUser}
        evidence={evidence}
        onUpdateEvidence={setEvidence}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <UserDashboard
      user={currentUser}
      evidence={evidence.filter((e) => e.studentId === currentUser.studentId)}
      onAddEvidence={(e) => setEvidence((prev) => [e, ...prev])}
      onNavigate={navigate}
      onLogout={handleLogout}
    />
  )
}
