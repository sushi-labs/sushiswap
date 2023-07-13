'use client'

import { SwapProvider } from './trade/TradeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return <SwapProvider>{children}</SwapProvider>
}
