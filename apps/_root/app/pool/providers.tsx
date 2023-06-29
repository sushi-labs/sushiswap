'use client'

import { TokenProvider } from 'ui/swap/token/TokenProvider'
import { SplashController } from '@sushiswap/ui/components/SplashController'
import { ThemeProvider } from '@sushiswap/ui'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TokenProvider>
        <SplashController>{children}</SplashController>
      </TokenProvider>
    </ThemeProvider>
  )
}
