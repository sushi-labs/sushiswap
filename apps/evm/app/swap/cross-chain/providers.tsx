'use client'

import { CrossChainSwapDeferUntilTokensReady } from 'ui/swap/cross-chain/cross-chain-swap-defer-until-tokens-ready'
import { DerivedstateCrossChainSwapProvider } from 'ui/swap/cross-chain/derivedstate-cross-chain-swap-provider'

export function Providers({ children, searchParams }: { children: React.ReactNode; searchParams: URLSearchParams }) {
  return (
    <DerivedstateCrossChainSwapProvider searchParams={searchParams}>
      <CrossChainSwapDeferUntilTokensReady>{children}</CrossChainSwapDeferUntilTokensReady>
    </DerivedstateCrossChainSwapProvider>
  )
}
