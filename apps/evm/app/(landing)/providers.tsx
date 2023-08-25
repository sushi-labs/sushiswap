'use client'

import { ThemeProvider } from '@sushiswap/ui'

export function Providers({ children, forcedTheme }: { children: React.ReactNode; forcedTheme?: 'dark' | 'light' }) {
  return <ThemeProvider forcedTheme={forcedTheme}>{children}</ThemeProvider>
}
