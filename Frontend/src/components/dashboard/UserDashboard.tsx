import { useState } from 'react'
import type { Page, User, Evidence, EvidenceStatus } from '../../types'
import { REQUIRED_HOURS } from '../../data'
import Layout from '../shared/Layout'
import StatusBadge from '../shared/StatusBadge'
import EvidencePreviewDialog from '../shared/EvidencePreviewDialog'
import AddEvidenceDialog from '../shared/AddEvidenceDialog'
import { Plus, Paperclip, Clock, CheckCircle, AlertCircle, CircleQuestionMark, Download } from 'lucide-react'
import jsPDF from 'jspdf'

interface Props {
  user: User
  evidence: Evidence[]
  onAddEvidence: (e: Evidence) => void
  onNavigate: (p: Page) => void
  onLogout: () => void
}

type Tab = 'all' | EvidenceStatus

export default function UserDashboard({ user, evidence, onAddEvidence, onNavigate, onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('all')
  const [preview, setPreview] = useState<Evidence | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const approvedHours = evidence.filter(e => e.status === 'approved').reduce((s, e) => s + e.hours, 0)
  const pendingHours = evidence.filter(e => e.status === 'pending').reduce((s, e) => s + e.hours, 0)
  const pct = Math.min((approvedHours / REQUIRED_HOURS) * 100, 100)

  const filtered = tab === 'all' ? evidence : evidence.filter(e => e.status === tab)
  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: evidence.length },
    { key: 'pending', label: 'Pending', count: evidence.filter(e => e.status === 'pending').length },
    { key: 'approved', label: 'Approved', count: evidence.filter(e => e.status === 'approved').length },
    { key: 'rejected', label: 'Rejected', count: evidence.filter(e => e.status === 'rejected').length },
  ]

  const STATUS_COLORS: Record<string, [number, number, number]> = {
    approved: [22, 163, 74],
    rejected: [185, 28, 28],
    pending: [217, 119, 6],
  }

  // Pulls the image format (PNG/JPEG) out of a base64 data URL
  function getImageFormat(dataUrl: string): 'PNG' | 'JPEG' | null {
    const match = dataUrl.match(/^data:image\/(png|jpeg|jpg)/i)
    if (!match) return null
    return match[1].toLowerCase() === 'png' ? 'PNG' : 'JPEG'
  }

  // Reads an image's natural pixel dimensions so we can scale it into the PDF 
  // page without distorting the aspect ratio.
  function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
      img.onerror = reject
      img.src = dataUrl
    })
  }

  async function exportEvidenceToPdf(evidence: Evidence[], title = 'Evidence Report') {
    const docPdf = new jsPDF()
    const pageWidth = docPdf.internal.pageSize.getWidth()
    const pageHeight = docPdf.internal.pageSize.getHeight()
    const margin = 14
    const contentWidth = pageWidth - margin * 2

    for (let i = 0; i < evidence.length; i++) {
      const e = evidence[i]
      if (i > 0) docPdf.addPage()

      let y = 20

      // Header
      docPdf.setFontSize(16)
      docPdf.setTextColor(30)
      docPdf.text(title, margin, y)
      y += 6
      docPdf.setFontSize(9)
      docPdf.setTextColor(120)
      docPdf.setFont('helvetica', 'normal')
      docPdf.text(`Evidence ${i + 1} of ${evidence.length} — Downloaded ${new Date().toLocaleDateString()}`, margin, y)
      y += 10

      // Divider
      docPdf.setDrawColor(220)
      docPdf.line(margin, y, pageWidth - margin, y)
      y += 10

      // Student / event details
      const fields: [string, string][] = [
        ['Student', e.studentName],
        ['zID', e.studentId],
        ['Event', e.eventName],
        ['Event date', new Date(e.eventDate).toLocaleDateString()],
        ['Hours', e.hours.toString()],
        ['Category', e.category],
        ['Submitted', new Date(e.submittedAt).toLocaleDateString()],
      ]

      docPdf.setFontSize(10)
      fields.forEach(([label, value]) => {
        docPdf.setTextColor(100)
        docPdf.setFont('helvetica', 'bold')
        docPdf.text(`${label}:`, margin, y)
        docPdf.setTextColor(30)
        docPdf.setFont('helvetica', 'normal')
        docPdf.text(value, margin + 35, y)
        y += 7
      })

      // Status (color-coded)
      docPdf.setTextColor(100)
      docPdf.setFont('helvetica', 'bold')
      docPdf.text('Status:', margin, y)
      const statusColor = STATUS_COLORS[e.status] ?? [30, 30, 30]
      docPdf.setTextColor(...statusColor)
      docPdf.setFont('helvetica', 'bold')
      docPdf.text(e.status.toUpperCase(), margin + 35, y)
      docPdf.setFont('helvetica', 'normal')
      y += 10

      // Rejection reason, if present
      if (e.status === 'rejected' && e.rejectionReason) {
        docPdf.setTextColor(185, 28, 28)
        docPdf.setFontSize(9)
        const reasonLines = docPdf.splitTextToSize(`Rejection reason: ${e.rejectionReason}`, contentWidth)
        docPdf.text(reasonLines, margin, y)
        y += reasonLines.length * 5 + 6
      }

      y += 4
      docPdf.setDrawColor(220)
      docPdf.line(margin, y, pageWidth - margin, y)
      y += 10

      // Embedded evidence image
      docPdf.setFontSize(10)
      docPdf.setTextColor(100)
      docPdf.setFont('helvetica', 'bold')
      docPdf.text('Evidence:', margin, y)
      y += 6

      const format = getImageFormat(e.evidenceFile)
      if (format) {
        try {
          const { width: imgW, height: imgH } = await getImageDimensions(e.evidenceFile)
          const maxW = contentWidth
          const maxH = pageHeight - y - margin

          // Scale to fit within available space, preserving aspect ratio
          const scale = Math.min(maxW / imgW, maxH / imgH, 1)
          const drawW = imgW * scale
          const drawH = imgH * scale

          docPdf.addImage(e.evidenceFile, format, margin, y, drawW, drawH)
        } catch (err) {
          docPdf.setFontSize(9)
          docPdf.setTextColor(185, 28, 28)
          docPdf.text('(Could not load evidence image)', margin, y)
        }
      } else {
        docPdf.setFontSize(9)
        docPdf.setTextColor(150)
        docPdf.text('(No valid image data for this record)', margin, y)
      }
    }

    docPdf.save(`evidence-summary-report.pdf`)
  }

  return (
    <Layout user={user} currentPage="dashboard" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6 lg:p-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1e1f3a' }}>
              Welcome back, {user.fullName.split(' ')[0]} 
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6b6f9e' }}>Track your volunteering hours progress</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Completed', value: `${approvedHours}h`, icon: CheckCircle, color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Required', value: `${REQUIRED_HOURS}h`, icon: AlertCircle, color: '#c73640', bg: '#ffebeb' },
            { label: 'Remaining', value: `${Math.max(REQUIRED_HOURS - approvedHours, 0)}h`, icon: CircleQuestionMark, color: '#d97706', bg: '#fffbeb' },
            { label: 'Pending', value: `${pendingHours}h`, icon: Clock, color: '#6b6f9e', bg: '#f5f7fd' },
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

        {/* Progress bar */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#fff', border: '1px solid #eef1fb' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs mt-0.5" style={{ color: '#6b6f9e' }}>
                {approvedHours}h completed · {Math.max(REQUIRED_HOURS - approvedHours, 0)}h remaining
              </p>
            </div>
            <span className="text-2xl font-bold" style={{ color: '#9396d4' }}>{Math.round(pct)}%</span>
          </div>
          <div className="h-4 rounded-full overflow-hidden" style={{ background: '#eef1fb' }}>
            <div
              className="h-full rounded-full progress-bar-animated"
              style={{
                '--progress-target': `${pct}%`,
                width: `${pct}%`,
                background: pct >= 100
                  ? '#4ebc76'
                  : '#9396d4',
                  // 'linear-gradient(90deg, #9396d4, #b9d0ee)',
              } as React.CSSProperties}
            />
          </div>
          {pct >= 100 && (
            <p className="text-xs mt-2 font-medium" style={{ color: '#16a34a' }}>🎉 You have reached your target!</p>
          )}
        </div>

        {/* Evidence table */}
        <div className="rounded-2xl" style={{ background: '#fff', border: '1px solid #eef1fb' }}>
          <div className="flex items-center justify-between px-6 pt-5 pb-0">
            <h2 className="font-semibold text-md" style={{ color: '#1e1f3a' }}>Evidence submissions</h2>
            <div className="flex gap-2">
              <button
                onClick={() => exportEvidenceToPdf(evidence)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl font-semibold transition-all active:scale-[0.98] hover:bg-[#f2f2fa]"
              >
                <Download color='#9396d4' size={20} />
              </button>
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: '#9396d4' }}
              >
                <Plus size={16} />
                Add evidence
              </button>
            </div>
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
              <div className="text-center py-12" style={{ color: '#9396d4' }}>
                <Clock size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm" style={{ color: '#6b6f9e' }}>No submissions in this category</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderTop: '1px solid #eef1fb' }}>
                    {['Event', 'Date', 'Hours', 'Category', 'Evidence', 'Status'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#6b6f9e', background: '#fafbff' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ev, i) => (
                    <tr key={ev.id} style={{ borderTop: '1px solid #eef1fb', background: i % 2 === 0 ? '#fff' : 'transparent' }}>
                      <td className="px-6 py-4">
                        <p className="font-medium" style={{ color: '#1e1f3a' }}>{ev.eventName}</p>
                        {ev.status === 'rejected' && ev.rejectionReason && (
                          <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#dc2626' }}>Reason: {ev.rejectionReason}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#6b6f9e' }}>{ev.eventDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold" style={{ color: '#9396d4' }}>{ev.hours}h</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs" style={{ background: '#eef1fb', color: '#6b6f9e' }}>{ev.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => setPreview(ev)}
                          className="flex items-center gap-1.5 text-xs font-medium hover:opacity-70 transition-opacity"
                          style={{ color: '#9396d4' }}>
                          <Paperclip size={13} /> View
                        </button>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={ev.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {preview && (
        <EvidencePreviewDialog
          filename={preview.eventName}
          fileType="image"
          imageData={preview.evidenceFile}
          onClose={() => setPreview(null)}
        />
      )}

      {showAdd && (
        <AddEvidenceDialog
          studentId={user.studentId}
          studentName={user.fullName}
          onAdd={onAddEvidence}
          onClose={() => setShowAdd(false)}
        />
      )}
    </Layout>
  )
}
