'use client'

import { SwapProvider } from 'ui/swap/trade/TradeProvider'
import { TokenProvider } from 'ui/swap/token/TokenProvider'
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TokenProvider>
      <SwapProvider>{children}</SwapProvider>
    </TokenProvider>
  )
}
