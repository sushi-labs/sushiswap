'use client'

import { SplashController, ThemeProvider } from '@sushiswap/ui'
import { DeferUntilWalletReady } from 'src/ui/swap/defer-until-wallet-ready'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DeferUntilWalletReady>
        <SplashController>{children}</SplashController>
      </DeferUntilWalletReady>
    </ThemeProvider>
  )
}
