import { useState } from 'react'
import type { Page, User, Evidence, EvidenceStatus } from '../../types'
import Layout from '../shared/Layout'
import StatusBadge from '../shared/StatusBadge'
import EvidencePreviewDialog from '../shared/EvidencePreviewDialog'
import { Check, X, Paperclip, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Props {
  user: User
  evidence: Evidence[]
  onUpdateEvidence: (ev: Evidence[]) => void
  onNavigate: (p: Page) => void
  onLogout: () => void
}

type Tab = 'all' | EvidenceStatus

export default function AdminDashboard({ user, evidence, onUpdateEvidence, onNavigate, onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('all')
  const [preview, setPreview] = useState<Evidence | null>(null)
  const [rejectTarget, setRejectTarget] = useState<Evidence | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const approve = (ev: Evidence) => {
    onUpdateEvidence(evidence.map(e => e.id === ev.id ? { ...e, status: 'approved' } : e))
  }

  const reject = () => {
    if (!rejectTarget) return
    onUpdateEvidence(evidence.map(e => e.id === rejectTarget.id ? { ...e, status: 'rejected', rejectionReason: rejectReason } : e))
    setRejectTarget(null)
    setRejectReason('')
  }

  const filtered = tab === 'all' ? evidence : evidence.filter(e => e.status === tab)
  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: evidence.length },
    { key: 'approved', label: 'Approved', count: evidence.filter(e => e.status === 'approved').length },
    { key: 'pending', label: 'Pending', count: evidence.filter(e => e.status === 'pending').length },
    { key: 'rejected', label: 'Rejected', count: evidence.filter(e => e.status === 'rejected').length },
  ]

  return (
    <Layout user={user} currentPage="admin" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6 lg:p-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: '#1e1f3a' }}>Admin panel</h1>
          <p className="text-sm mt-1" style={{ color: '#6b6f9e' }}>Review and manage evidence submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total submissions', value: evidence.length, icon: AlertCircle, color: '#9396d4', bg: 'rgba(147,150,212,0.08)' },
            { label: 'Approved', value: evidence.filter(e => e.status === 'approved').length, icon: CheckCircle, color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Pending review', value: evidence.filter(e => e.status === 'pending').length, icon: Clock, color: '#d97706', bg: '#fffbeb' },
            { label: 'Rejected', value: evidence.filter(e => e.status === 'rejected').length, icon: XCircle, color: '#dc2626', bg: '#fef2f2' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid #eef1fb' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: '#6b6f9e' }}>{label}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                  <Icon size={14} style={{ color }} />
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#1e1f3a' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Evidence table */}
        <div className="rounded-2xl" style={{ background: '#fff', border: '1px solid #eef1fb' }}>
          <div className="px-6 pt-5 pb-0">
            <h2 className="font-semibold text-sm" style={{ color: '#1e1f3a' }}>Evidence submissions</h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 pt-4 pb-0">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{ background: tab === t.key ? 'rgba(147,150,212,0.12)' : 'transparent', color: tab === t.key ? '#9396d4' : '#6b6f9e' }}>
                {t.label}
                <span className="px-1.5 py-0.5 rounded-full text-xs" style={{ background: tab === t.key ? '#9396d4' : '#eef1fb', color: tab === t.key ? '#fff' : '#6b6f9e' }}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-4">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <Clock size={32} className="mx-auto mb-2 opacity-40" style={{ color: '#9396d4' }} />
                <p className="text-sm" style={{ color: '#6b6f9e' }}>No submissions in this category</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderTop: '1px solid #eef1fb' }}>
                    {['Student', 'Event', 'Date', 'Hours', 'Category', 'Evidence', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: '#6b6f9e', background: '#fafbff' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ev, i) => (
                    <tr key={ev.id} style={{ borderTop: '1px solid #eef1fb', background: i % 2 === 0 ? '#fff' : 'transparent' }}>
                      <td className="px-5 py-4">
                        <p className="font-medium text-xs" style={{ color: '#1e1f3a' }}>{ev.studentName}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#9396d4' }}>{ev.studentId}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium" style={{ color: '#1e1f3a' }}>{ev.eventName}</p>
                        {ev.rejectionReason && (
                          <p className="text-xs mt-0.5 line-clamp-1 max-w-xs" style={{ color: '#dc2626' }}>{ev.rejectionReason}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs" style={{ color: '#6b6f9e' }}>{ev.eventDate}</td>
                      <td className="px-5 py-4 whitespace-nowrap font-semibold text-xs" style={{ color: '#9396d4' }}>{ev.hours}h</td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 rounded-full text-xs" style={{ background: '#eef1fb', color: '#6b6f9e' }}>{ev.category}</span>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => setPreview(ev)}
                          className="flex items-center gap-1 text-xs font-medium hover:opacity-70 transition-opacity whitespace-nowrap"
                          style={{ color: '#9396d4' }}>
                          <Paperclip size={12} /> View
                        </button>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={ev.status} /></td>
                      <td className="px-5 py-4">
                        {ev.status === 'pending' && (
                          <div className="flex gap-1.5">
                            <button onClick={() => approve(ev)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                              style={{ background: '#f0fdf4', color: '#16a34a' }}>
                              <Check size={13} /> Approve
                            </button>
                            <button onClick={() => { setRejectTarget(ev); setRejectReason('') }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                              style={{ background: '#fef2f2', color: '#dc2626' }}>
                              <X size={13} /> Reject
                            </button>
                          </div>
                        )}
                        {ev.status !== 'pending' && (
                          <span className="text-xs" style={{ color: '#c4c8e6' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {preview && (
        <EvidencePreviewDialog filename={preview.evidenceFile} fileType={preview.evidenceType} onClose={() => setPreview(null)} />
      )}

      {/* Reject dialog */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(30,31,58,0.5)' }} onClick={() => setRejectTarget(null)}>
          <div className="w-full max-w-md rounded-2xl shadow-2xl animate-fade-in" style={{ background: '#fff' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #eef1fb' }}>
              <h3 className="font-bold text-sm" style={{ color: '#1e1f3a' }}>Reject submission</h3>
              <button onClick={() => setRejectTarget(null)} className="p-1 rounded-lg hover:bg-gray-100" style={{ color: '#6b6f9e' }}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                <p className="text-sm font-medium" style={{ color: '#dc2626' }}>{rejectTarget.eventName}</p>
                <p className="text-xs mt-0.5" style={{ color: '#dc2626' }}>{rejectTarget.studentName} · {rejectTarget.hours}h</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1e1f3a' }}>Reason / note for student</label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Explain why this submission is being rejected..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-none"
                  style={{ border: '1.5px solid #dde2f5', background: '#fff', color: '#1e1f3a' }}
                  onFocus={e => { e.target.style.borderColor = '#9396d4'; e.target.style.boxShadow = '0 0 0 3px rgba(147,150,212,0.15)' }}
                  onBlur={e => { e.target.style.borderColor = '#dde2f5'; e.target.style.boxShadow = 'none' }}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setRejectTarget(null)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{ border: '1.5px solid #dde2f5', color: '#6b6f9e', background: '#fff' }}>
                  Cancel
                </button>
                <button onClick={reject}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: '#dc2626' }}>
                  Reject submission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
