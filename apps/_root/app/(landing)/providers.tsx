'use client'

import { ThemeProvider } from '@sushiswap/ui/ThemeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider forcedTheme="dark">{children}</ThemeProvider>
}
