'use client'

import { ThemeProvider } from '@sushiswap/ui'
import { SplashController } from '@sushiswap/ui/components/SplashController'
import { CheckerProvider } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { TokenProvider } from 'ui/swap/token/TokenProvider'
import { SwapProvider } from 'ui/swap/trade/TradeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TokenProvider>
        <SplashController>
          <SwapProvider>
            <CheckerProvider>{children}</CheckerProvider>
          </SwapProvider>
        </SplashController>
      </TokenProvider>
    </ThemeProvider>
  )
}
