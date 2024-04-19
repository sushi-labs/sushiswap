'use client'

import { ThemeProvider } from '@sushiswap/ui'
import { QueryClientProvider } from '../providers/query-client-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}
