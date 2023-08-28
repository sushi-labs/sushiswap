'use client'

import { ThemeProvider } from '@sushiswap/ui'
import { SplashController } from '@sushiswap/ui/components/SplashController'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SplashController>{children}</SplashController>
    </ThemeProvider>
  )
}
