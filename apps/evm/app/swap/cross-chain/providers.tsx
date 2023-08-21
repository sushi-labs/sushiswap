'use client'

import { CrossChainSwapDeferUntilTokensReady } from 'ui/swap/cross-chain/cross-chain-swap-defer-until-tokens-ready'
import { DerivedstateCrossChainSwapProvider } from 'ui/swap/cross-chain/derivedstate-cross-chain-swap-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DerivedstateCrossChainSwapProvider>
      <CrossChainSwapDeferUntilTokensReady>{children}</CrossChainSwapDeferUntilTokensReady>
    </DerivedstateCrossChainSwapProvider>
  )
}
