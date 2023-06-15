'use client'

import { SwapProvider } from 'ui/swap/trade/TradeProvider'
import { TokenProvider } from 'ui/swap/token/TokenProvider'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'
import { ThemeProvider } from '@sushiswap/ui'

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
