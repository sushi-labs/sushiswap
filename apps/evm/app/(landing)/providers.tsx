'use client'

import { ThemeProvider } from '@sushiswap/ui'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
