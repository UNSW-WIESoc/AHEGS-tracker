import { useState, useRef } from 'react'
import type { Page, User } from '../../types'
import Layout from '../shared/Layout'
import { Camera, Edit2, Save, X, User as UserIcon, Hash, Mail, Phone, GraduationCap, BookOpen, FileText } from 'lucide-react'

interface Props {
  user: User
  onUpdateUser: (u: User) => void
  onNavigate: (p: Page) => void
  onLogout: () => void
}

const DEGREES = [
  'Bachelor of Engineering (Civil)',
  'Bachelor of Engineering (Electrical)',
  'Bachelor of Engineering (Mechanical)',
  'Bachelor of Engineering (Software)',
  'Bachelor of Engineering (Chemical)',
  'Bachelor of Engineering (Environmental)',
  'Bachelor of Engineering (Aerospace)',
  'Master of Engineering',
  'PhD (Engineering)',
]

export default function ProfilePage({ user, onUpdateUser, onNavigate, onLogout }: Props) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...user })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatar ?? null)
  const fileRef = useRef<HTMLInputElement>(null)

  const initials = user.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      const url = URL.createObjectURL(f)
      setAvatarUrl(url)
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const save = () => {
    onUpdateUser({ ...form, avatar: avatarUrl ?? undefined })
    setEditing(false)
  }

  const cancel = () => {
    setForm({ ...user })
    setAvatarUrl(user.avatar ?? null)
    setEditing(false)
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
  const inputStyle = editing
    ? { border: '1.5px solid #dde2f5', background: '#fff', color: '#1e1f3a' }
    : { border: '1.5px solid transparent', background: '#fafbff', color: '#1e1f3a' }
  const focusFn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editing) return
    e.target.style.borderColor = '#9396d4'
    e.target.style.boxShadow = '0 0 0 3px rgba(147,150,212,0.15)'
  }
  const blurFn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = editing ? '#dde2f5' : 'transparent'
    e.target.style.boxShadow = 'none'
  }

  return (
    <Layout user={user} currentPage="profile" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="flex-1 flex flex-col justify-between mb-8 p-4">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1e1f3a' }}>Profile</h1>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'rgba(147,150,212,0.1)', color: '#9396d4', border: '1.5px solid rgba(147,150,212,0.2)' }}>
              <Edit2 size={15} /> Edit profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={cancel}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ border: '1.5px solid #dde2f5', color: '#6b6f9e', background: '#fff' }}>
                <X size={15} /> Cancel
              </button>
              <button onClick={save}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #9396d4, #7b7fc4)' }}>
                <Save size={15} /> Save changes
              </button>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="rounded-2xl p-6 mb-4 flex items-center gap-5" style={{ background: '#fff', border: '1px solid #eef1fb' }}>
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt={user.fullName} className="w-20 h-20 rounded-2xl object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #9396d4, #b9d0ee)' }}>
                {initials}
              </div>
            )}
            {editing && (
              <>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                <button onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{ background: '#9396d4' }}>
                  <Camera size={13} />
                </button>
              </>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#1e1f3a' }}>{user.fullName}</h2>
            <p className="text-sm" style={{ color: '#9396d4' }}>{user.role === 'admin' ? 'Administrator' : `Year ${user.yearOfStudy} · ${user.degree}`}</p>
            <p className="text-xs mt-1" style={{ color: '#6b6f9e' }}>{user.email}</p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #eef1fb' }}>
          <h3 className="font-semibold text-sm mb-5" style={{ color: '#1e1f3a' }}>Personal information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: '#6b6f9e' }}>
                  <UserIcon size={13} /> Full name
                </label>
                <input type="text" value={form.fullName} onChange={set('fullName')} disabled={!editing}
                  className={inputClass} style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: '#6b6f9e' }}>
                  <Hash size={13} /> zID
                </label>
                <input type="text" value={form.studentId} disabled={!editing}
                  className={inputClass} style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: '#6b6f9e' }}>
                <Mail size={13} /> Email address
              </label>
              <input type="email" value={form.email} onChange={set('email')} disabled={!editing}
                className={inputClass} style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: '#6b6f9e' }}>
                <Phone size={13} /> Phone number
              </label>
              <input type="tel" value={form.phone ?? ''} onChange={set('phone')} disabled={!editing} placeholder={editing ? '+61 4XX XXX XXX' : ''}
                className={inputClass} style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: '#6b6f9e' }}>
                  <GraduationCap size={13} /> Degree
                </label>
                {editing ? (
                  <select value={form.degree} onChange={set('degree')}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all appearance-none"
                    style={inputStyle} onFocus={focusFn} onBlur={blurFn}>
                    {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                ) : (
                  <input value={form.degree} disabled className={inputClass} style={inputStyle} />
                )}
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: '#6b6f9e' }}>
                  <BookOpen size={13} /> Year of study
                </label>
                <input type="number" min={1} max={6} value={form.yearOfStudy} onChange={e => setForm(f => ({ ...f, yearOfStudy: parseInt(e.target.value) || 1 }))} disabled={!editing}
                  className={inputClass} style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: '#6b6f9e' }}>
                <FileText size={13} /> Bio
              </label>
              <textarea value={form.bio ?? ''} onChange={set('bio')} disabled={!editing} placeholder={editing ? 'Tell us a little about yourself...' : ''} rows={3}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-none"
                style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
