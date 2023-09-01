'use client'

import { SplashController, ThemeProvider } from '@sushiswap/ui'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SplashController>{children}</SplashController>
    </ThemeProvider>
  )
}
