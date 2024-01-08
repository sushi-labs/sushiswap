'use client'

import { SplashController, ThemeProvider } from '@sushiswap/ui'
import { SushiBarProvider } from 'src/ui/bar'
import { DeferUntilWalletReady } from 'src/ui/swap/defer-until-wallet-ready'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DeferUntilWalletReady>
        <SplashController>
          <SushiBarProvider>{children}</SushiBarProvider>
        </SplashController>
      </DeferUntilWalletReady>
    </ThemeProvider>
  )
}
