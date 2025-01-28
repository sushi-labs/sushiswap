'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session } from '../../lib/client-config'

const AuthContext = createContext<Session>({ isLoggedIn: false })

interface AuthProvider {
  children: React.ReactNode
  initialSession: Session
}

export function AuthProvider({ initialSession, children }: AuthProvider) {
  const [session, setSession] = useState<Session>(initialSession)

  useEffect(() => {
    if (session !== initialSession) {
      setSession(initialSession)
    }
  }, [session, initialSession])

  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
}

export function useSession() {
  const session = useContext(AuthContext)

  if (!session) {
    throw new Error('useSession must be used within an AuthProvider')
  }

  return session
}
