import { X, FileText, Image } from 'lucide-react'

interface Props {
  filename: string
  fileType: 'image' | 'pdf'
  onClose: () => void
}

export default function EvidencePreviewDialog({ filename, fileType, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(30,31,58,0.5)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in" style={{ background: '#fff' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #eef1fb' }}>
          <h3 className="font-semibold text-sm" style={{ color: '#1e1f3a' }}>{filename}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100" style={{ color: '#6b6f9e' }}>
            <X size={18} />
          </button>
        </div>
        <div className="p-8 flex flex-col items-center justify-center min-h-48" style={{ background: '#f5f7fd' }}>
          {fileType === 'image' ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-32 h-32 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e8eaf8, #d4ddf5)' }}>
                <Image size={48} style={{ color: '#9396d4' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: '#1e1f3a' }}>{filename}</p>
              <p className="text-xs" style={{ color: '#9396d4' }}>Image preview (demo mode)</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-32 h-32 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e8eaf8, #d4ddf5)' }}>
                <FileText size={48} style={{ color: '#9396d4' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: '#1e1f3a' }}>{filename}</p>
              <p className="text-xs" style={{ color: '#9396d4' }}>PDF preview (demo mode)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
