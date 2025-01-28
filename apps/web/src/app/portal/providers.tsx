'use client'

import { QueryClientProvider } from 'src/providers/query-client-provider'
import { Session } from './_common/lib/client-config'
import { AuthProvider } from './_common/ui/auth-provider/auth-provider'

interface Providers {
  children: React.ReactNode
  authSession: Session
}

export function Providers({ children, authSession }: Providers) {
  return (
    <AuthProvider initialSession={authSession}>
      <QueryClientProvider>{children}</QueryClientProvider>
    </AuthProvider>
  )
}
