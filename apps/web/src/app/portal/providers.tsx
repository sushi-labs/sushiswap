'use client'

import { ThemeProvider } from 'next-themes'
import { QueryClientProvider } from 'src/providers/query-client-provider'
import type { Session } from './_common/lib/client-config'
import { AuthProvider } from './_common/ui/auth-provider/auth-provider'

interface Providers {
  children: React.ReactNode
  authSession: Session
}

export function Providers({ children, authSession }: Providers) {
  return (
    <ThemeProvider
      forcedTheme="black"
      themes={['dark', 'black']}
      attribute="class"
    >
      <AuthProvider initialSession={authSession}>
        <QueryClientProvider>{children}</QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
