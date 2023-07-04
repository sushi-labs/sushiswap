'use client'

import { ThemeProvider } from '@sushiswap/ui'
import { SplashController } from '@sushiswap/ui/components/SplashController'
import { TokenProvider } from 'ui/swap/token/TokenProvider'
import { SwapProvider } from 'ui/swap/trade/TradeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TokenProvider>
        <SplashController>
          <SwapProvider>{children}</SwapProvider>
        </SplashController>
      </TokenProvider>
    </ThemeProvider>
  )
}
