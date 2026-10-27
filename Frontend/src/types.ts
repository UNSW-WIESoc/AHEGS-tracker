export type Page =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'dashboard'
  | 'admin'
  | 'profile'

export type EvidenceStatus = 'pending' | 'approved' | 'rejected'

export type EvidenceCategory =
  | 'Weekly Meetings'
  | 'Training Workshop (/2)'
  | 'OC (/2)'
  | 'CP1 (/2)'
  | 'CP2 (/2)'
  | 'CC (/2)'
  | 'Reflection for ms (0.5hr each)'

export interface Evidence {
  id: string
  studentId: string | undefined
  studentName: string
  eventName: string
  eventDate: string
  hours: number
  category: EvidenceCategory
  status: EvidenceStatus
  evidenceFile: string // filename or data url
  evidenceType: 'image'
  rejectionReason?: string
  submittedAt: string
}

export interface User {
  id: string
  fullName: string
  studentId?: string
  email: string
  degree?: string
  yearOfStudy?: number
  role: 'student' | 'admin' | 'mentor'
  expertise?: string
  company?: string
  avatar?: string
  bio?: string
  phone?: string
}

export type Role = "student" | "admin" | "mentor";
