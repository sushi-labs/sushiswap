'use client'

import { DerivedstateSimpleSwapProvider } from 'ui/swap/simple/derivedstate-simple-swap-provider'
import { SimpleSwapDeferUntilTokensReady } from 'ui/swap/simple/simple-swap-defer-until-tokens-ready'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DerivedstateSimpleSwapProvider>
      <SimpleSwapDeferUntilTokensReady>{children}</SimpleSwapDeferUntilTokensReady>
    </DerivedstateSimpleSwapProvider>
  )
}
