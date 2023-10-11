'use client'

import { DerivedstateSimpleSwapProvider } from 'ui/swap/simple/derivedstate-simple-swap-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DerivedstateSimpleSwapProvider>{children}</DerivedstateSimpleSwapProvider>
  )
}
