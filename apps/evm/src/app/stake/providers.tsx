'use client'

import { SplashController, ThemeProvider } from '@sushiswap/ui'
import { SushiBarProvider } from 'src/ui/stake'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SplashController>
        <SushiBarProvider>{children}</SushiBarProvider>
      </SplashController>
    </ThemeProvider>
  )
}
