'use client'

import { ThemeProvider } from '@sushiswap/ui'
import { SplashController } from '@sushiswap/ui'
import { TokenProvider } from 'ui/swap/token/TokenProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TokenProvider>
        <SplashController>{children}</SplashController>
      </TokenProvider>
    </ThemeProvider>
  )
}
