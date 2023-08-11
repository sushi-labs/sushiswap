'use client'

import { DeferUntilWalletReady } from 'ui/swap/simple/defer-until-wallet-ready'
import { DerivedStateSimpleSwapProvider } from 'ui/swap/simple/derivedstate-simpleswap-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DeferUntilWalletReady>
      <DerivedStateSimpleSwapProvider>{children}</DerivedStateSimpleSwapProvider>
    </DeferUntilWalletReady>
  )
}
