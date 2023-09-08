'use client'

import { DerivedstateCrossChainSwapProvider } from 'ui/swap/cross-chain/derivedstate-cross-chain-swap-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return <DerivedstateCrossChainSwapProvider>{children}</DerivedstateCrossChainSwapProvider>
}
