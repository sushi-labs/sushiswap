'use client'

import { ThemeProvider } from '@sushiswap/ui'
import { SplashController } from 'ui/swap/SplashController'
import { TokenProvider } from 'ui/swap/token/TokenProvider'
import { SwapProvider } from 'ui/swap/trade/TradeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SplashController>
        <TokenProvider>
          <SwapProvider>{children}</SwapProvider>
        </TokenProvider>
      </SplashController>
    </ThemeProvider>
  )
}
