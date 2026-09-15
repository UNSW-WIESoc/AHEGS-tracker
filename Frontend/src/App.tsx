import { useState, useEffect } from 'react'
import type { Page, User, Evidence } from './types'
import LoginPage from './components/auth/LoginPage'
import RegisterPage from './components/auth/RegisterPage'
import ForgotPasswordPage from './components/auth/ForgotPasswordPage'
import UserDashboard from './components/dashboard/UserDashboard'
import AdminDashboard from './components/dashboard/AdminDashboard'
import ProfilePage from './components/profile/ProfilePage'

import { auth, db } from './firebase'
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  orderBy
} from 'firebase/firestore'

function getLoginErrorMessage(error: any): string {
  switch (error?.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/user-disabled':
      return 'This account has been disabled.'
    default:
      return error?.message || 'Login failed'
  }
}

export default function App() {
  const [page, setPage] = useState<Page>('login')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [loading, setLoading] = useState(true)

  const navigate = (p: Page) => setPage(p)

  // 1. Listen for Authentication Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid)
          const userDocSnap = await getDoc(userDocRef)

          if (userDocSnap.exists()) {
            const profile = userDocSnap.data() as User
            setCurrentUser(profile)
            setPage(profile.role === 'admin' ? 'admin' : 'dashboard')
          } else {
            // First-time sign-in: auto-create their profile
            const studentZid = firebaseUser.email?.split('@')[0] || firebaseUser.uid.substring(0, 8)

            const defaultProfile: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              fullName: firebaseUser.displayName || 'New Student',
              role: 'student',
              studentId: studentZid,
              degree: '',
              yearOfStudy: 1,
            }

            await setDoc(userDocRef, defaultProfile)
            setCurrentUser(defaultProfile)
            setPage('dashboard')
          }
        } else {
          setCurrentUser(null)
          setEvidence([])
          setPage('login')
        }
      } catch (error) {
        console.error("Error during auth state change:", error)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // 2. Fetch evidence logs from Firestore when logged in
  useEffect(() => {
    if (!currentUser) return

    const fetchEvidence = async () => {
      try {
        const evidenceRef = collection(db, 'evidence')
        let q

        if (currentUser.role === 'admin') {
          q = query(evidenceRef, orderBy('createdAt', 'desc'))
        } else {
          q = query(
            evidenceRef,
            where('studentId', '==', currentUser.studentId),
            orderBy('createdAt', 'desc')
          )
        }

        const querySnapshot = await getDocs(q)
        const loadedEvidence = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Evidence[]

        setEvidence(loadedEvidence)
      } catch (error) {
        console.error("Error fetching evidence from Firestore:", error)
      }
    }

    fetchEvidence()
  }, [currentUser])

  // 3. Add a new evidence log to Firestore
  const handleAddEvidence = async (newLog: Omit<Evidence, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'evidence'), {
        ...newLog,
        createdAt: new Date().toISOString()
      })

      const savedLog = { id: docRef.id, ...newLog } as Evidence
      setEvidence((prev) => [savedLog, ...prev])
    } catch (error) {
      console.error("Error adding evidence to Firestore:", error)
    }
  }

  // 4. Handle status updates (admin approving/rejecting a submission)
  const handleUpdateEvidence = async (updatedList: Evidence[]) => {
    setEvidence(updatedList)

    try {
      for (const item of updatedList) {
        const docRef = doc(db, 'evidence', item.id)
        await updateDoc(docRef, { ...item })
      }
    } catch (error) {
      console.error("Error updating evidence in Firestore:", error)
    }
  }

  // Handle password login
  const handleLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      throw new Error(getLoginErrorMessage(error))
    }
  }

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Sign-out error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2fc]">
        <p className="text-[#9396d4] font-semibold animate-pulse">Loading WIESOC AHEGS Tracker...</p>
      </div>
    )
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
        onUpdateEvidence={handleUpdateEvidence}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <UserDashboard
      user={currentUser}
      evidence={evidence}
      onAddEvidence={handleAddEvidence}
      onNavigate={navigate}
      onLogout={handleLogout}
    />
  )
}