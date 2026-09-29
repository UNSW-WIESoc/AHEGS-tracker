import type { Page, User } from '../../types'
import WiesocLogo from './WiesocLogo'
import { LayoutDashboard, LogOut, Shield, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface Props {
  user: User
  currentPage: Page
  onNavigate: (p: Page) => void
  onLogout: () => void
  children: React.ReactNode
}

const SIDEBAR_BG = 'linear-gradient(160deg, #9396d4 0%, #a3b5df 100%)'

export default function Layout({ user, currentPage, onNavigate, onLogout, children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = user.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const dashPage: Page = user.role === 'admin' ? 'admin' : 'dashboard'

  const navItems = [
    { page: dashPage, label: user.role === 'admin' ? 'Admin Panel' : 'Dashboard', icon: user.role === 'admin' ? Shield : LayoutDashboard },
  ]

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-4 py-6 mb-2">
        <WiesocLogo size="md" tint="#ebf0fc" />
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {navItems.map(({ page, label, icon: Icon }) => {
          const active = currentPage === page
          return (
            <button
              key={page}
              onClick={() => { onNavigate(page); setMobileOpen(false) }}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active ? 'rgba(255,255,255,0.22)' : 'transparent',
                color: active ? '#ffffff' : 'rgba(255,255,255,0.72)',
                boxShadow: active ? 'inset 0 0 0 1px rgba(255,255,255,0.2)' : 'none',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <Icon size={18} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Sign out + user info pinned to bottom */}
      <div className="px-3 pb-4 flex flex-col gap-2">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: 'rgba(255,255,255,0.72)', background: 'transparent' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        >
          <LogOut size={18} />
          Sign out
        </button>

        <button
          type="button"
          onClick={() => { onNavigate('profile'); setMobileOpen(false) }}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-left transition-all"
          style={{
            background: currentPage === 'profile' ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.12)',
            boxShadow: currentPage === 'profile' ? 'inset 0 0 0 1px rgba(255,255,255,0.2)' : 'none',
          }}
          onMouseEnter={e => { if (currentPage !== 'profile') (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)' }}
          onMouseLeave={e => { if (currentPage !== 'profile') (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)' }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: '#b9d0ee', color: '#1e1f3a' }}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate text-white">{user.fullName}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {user.role === 'admin' ? 'Administrator' : user.studentId}
            </p>
          </div>
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#f5f7fd' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 shrink-0"
        style={{ background: SIDEBAR_BG, minHeight: '100vh' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile top nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{ background: '#9396d4' }}>
        <WiesocLogo size="sm" tint="#ffffff" />
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: 'white' }}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-20 flex" onClick={() => setMobileOpen(false)}>
          <div className="w-64 flex flex-col pt-14" style={{ background: SIDEBAR_BG }}
            onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </div>
          <div className="flex-1" style={{ background: 'rgba(0,0,0,0.3)' }} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 mt-14 lg:mt-0">
        {children}
      </main>
    </div>
  )
}
