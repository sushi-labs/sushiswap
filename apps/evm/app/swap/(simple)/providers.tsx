'use client'

import { DerivedstateSimpleSwapProvider } from 'ui/swap/simple/derivedstate-simple-swap-provider'
import { SimpleSwapDeferUntilTokensReady } from 'ui/swap/simple/simple-swap-defer-until-tokens-ready'

export function Providers({ children, searchParams }: { children: React.ReactNode; searchParams: URLSearchParams }) {
  return (
    <DerivedstateSimpleSwapProvider searchParams={searchParams}>
      <SimpleSwapDeferUntilTokensReady>{children}</SimpleSwapDeferUntilTokensReady>
    </DerivedstateSimpleSwapProvider>
  )
}
