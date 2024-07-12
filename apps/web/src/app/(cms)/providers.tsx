'use client'

import { ThemeProvider } from 'next-themes'
import { QueryClientProvider } from 'src/providers/query-client-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}
