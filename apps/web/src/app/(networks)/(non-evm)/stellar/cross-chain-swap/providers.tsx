'use client'

import { StellarCrossChainSwapProvider } from './_ui/cross-chain-swap-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StellarCrossChainSwapProvider>{children}</StellarCrossChainSwapProvider>
  )
}
