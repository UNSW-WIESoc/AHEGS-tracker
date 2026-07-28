import { X } from 'lucide-react'

interface Props {
  filename: string
  fileType: 'image'
  imageData: string
  onClose: () => void
}

export default function EvidencePreviewDialog({ filename, imageData, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(30,31,58,0.5)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in" style={{ background: '#fff' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #eef1fb' }}>
          <h3 className="font-semibold text-sm" style={{ color: '#1e1f3a' }}>{filename}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100" style={{ color: '#6b6f9e' }}>
            <X size={18} />
          </button>
        </div>
        <div className="flex items-center justify-center" style={{ background: '#f5f7fd' }}>
          <img src={imageData} alt={filename} className="max-h-[70vh] w-full object-contain" />
        </div>
      </div>
    </div>
  )
}