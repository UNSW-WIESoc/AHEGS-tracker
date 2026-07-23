import type { EvidenceStatus } from '../../types'

const styles: Record<EvidenceStatus, { bg: string; color: string; label: string }> = {
  approved: { bg: '#f0fdf4', color: '#16a34a', label: 'Approved' },
  pending: { bg: '#fffbeb', color: '#d97706', label: 'Pending' },
  rejected: { bg: '#fef2f2', color: '#dc2626', label: 'Rejected' },
}

export default function StatusBadge({ status }: { status: EvidenceStatus }) {
  const s = styles[status]
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  )
}
