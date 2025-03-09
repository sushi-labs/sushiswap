'use client'

import { type StyroClient, createStyroClient } from '@sushiswap/styro-client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Session } from '../../lib/client-config'
import { STYRO_BASE_PATH } from '../../lib/styro/config'

const AuthContext = createContext<{
  session: Session
  client: StyroClient | null
}>({ session: { isLoggedIn: false }, client: null })

interface AuthProvider {
  children: React.ReactNode
  initialSession: Session
}

function getStyroClient(session: Session) {
  if (!session.isLoggedIn) {
    return null
  }

  return createStyroClient({
    basePath: STYRO_BASE_PATH,
    accessToken: {
      sessionId: session.session.id,
      sessionToken: session.session.token,
    },
  })
}

export function AuthProvider({ initialSession, children }: AuthProvider) {
  const [session, setSession] = useState<Session>(initialSession)
  const [styroClient, setStyroClient] = useState<StyroClient | null>(
    getStyroClient(session),
  )

  useEffect(() => {
    setStyroClient(getStyroClient(session))
  }, [session])

  useEffect(() => {
    if (session !== initialSession) {
      setSession(initialSession)
    }
  }, [session, initialSession])

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          session,
          client: styroClient,
        }),
        [session, styroClient],
      )}
    >
      {children}
    </AuthContext.Provider>
  )
}

type UseSessionReturnType<REQUIRED extends boolean> = REQUIRED extends true
  ? Extract<Session, { isLoggedIn: true }>
  : Session

export function useSession<REQUIRED extends boolean = false>(
  required?: REQUIRED,
): UseSessionReturnType<REQUIRED> {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useSession must be used within an AuthProvider')
  }

  if (required && !context.session.isLoggedIn) {
    throw new Error('User is not logged in')
  }

  return context.session as UseSessionReturnType<REQUIRED>
}

type UseStyroClientReturnType<REQUIRED extends boolean> = REQUIRED extends true
  ? StyroClient
  : StyroClient | null

export function useStyroClient<REQUIRED extends boolean = false>(
  required?: REQUIRED,
): UseStyroClientReturnType<REQUIRED> {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useStyroClient must be used within an AuthProvider')
  }

  if (required && !context.client) {
    throw new Error('Styro client is required')
  }

  return context.client as UseStyroClientReturnType<REQUIRED>
}
