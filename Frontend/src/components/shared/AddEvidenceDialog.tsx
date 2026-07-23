import { useState, useRef } from 'react'
import type { Evidence, EvidenceCategory } from '../../types'
import { X, Upload, Calendar, Clock, Tag, FileText } from 'lucide-react'

const CATEGORIES: EvidenceCategory[] = ['Meeting', 'Networking', 'Society Event', 'Workshop', 'Conference', 'Volunteering', 'Other']

interface Props {
  studentId: string
  studentName: string
  onAdd: (e: Evidence) => void
  onClose: () => void
}

const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
const inputStyle = { border: '1.5px solid #dde2f5', background: '#fff', color: '#1e1f3a' }
const focusFn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = '#9396d4'
  e.target.style.boxShadow = '0 0 0 3px rgba(147,150,212,0.15)'
}
const blurFn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = '#dde2f5'
  e.target.style.boxShadow = 'none'
}

export default function AddEvidenceDialog({ studentId, studentName, onAdd, onClose }: Props) {
  const [form, setForm] = useState({ eventName: '', eventDate: '', hours: '', category: '' as EvidenceCategory | '' })
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.eventName || !form.eventDate || !form.hours || !form.category || !file) {
      setError('Please fill in all fields and upload evidence.')
      return
    }
    const evidence: Evidence = {
      id: `e-${Date.now()}`,
      studentId,
      studentName,
      eventName: form.eventName,
      eventDate: form.eventDate,
      hours: parseFloat(form.hours),
      category: form.category as EvidenceCategory,
      status: 'pending',
      evidenceFile: file.name,
      evidenceType: file.type.includes('pdf') ? 'pdf' : 'image',
      submittedAt: new Date().toISOString().split('T')[0],
    }
    onAdd(evidence)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(30,31,58,0.5)' }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl animate-fade-in" style={{ background: '#fff' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #eef1fb' }}>
          <h2 className="font-bold text-base" style={{ color: '#1e1f3a' }}>Add evidence</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100" style={{ color: '#6b6f9e' }}><X size={18} /></button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          {error && <div className="p-3 rounded-lg text-sm" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>{error}</div>}

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1e1f3a' }}>Event name</label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9396d4' }} />
              <input type="text" value={form.eventName} onChange={set('eventName')} placeholder="e.g. Industry Networking Night"
                className={inputClass} style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1e1f3a' }}>Event date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9396d4' }} />
                <input type="date" value={form.eventDate} onChange={set('eventDate')}
                  className={inputClass} style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1e1f3a' }}>Hours earned</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9396d4' }} />
                <input type="number" min="0.5" max="24" step="0.5" value={form.hours} onChange={set('hours')} placeholder="e.g. 2"
                  className={inputClass} style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1e1f3a' }}>Event category</label>
            <div className="relative">
              <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9396d4' }} />
              <select value={form.category} onChange={set('category')}
                className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all appearance-none"
                style={inputStyle} onFocus={focusFn} onBlur={blurFn}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1e1f3a' }}>Upload evidence</label>
            <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-full py-6 rounded-xl border-2 border-dashed flex flex-col items-center gap-2 transition-all hover:opacity-80"
              style={{ borderColor: file ? '#9396d4' : '#dde2f5', background: file ? 'rgba(147,150,212,0.05)' : '#fafbff' }}>
              <Upload size={20} style={{ color: '#9396d4' }} />
              <span className="text-sm" style={{ color: file ? '#9396d4' : '#6b6f9e' }}>
                {file ? file.name : 'Click to upload image or PDF'}
              </span>
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
              style={{ border: '1.5px solid #dde2f5', color: '#6b6f9e', background: '#fff' }}>
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #9396d4, #7b7fc4)' }}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
