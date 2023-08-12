'use client'

import { CheckerProvider } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { DeferUntilWalletReady } from 'ui/swap/defer-until-wallet-ready'
import { DerivedstateSimpleSwapProvider } from 'ui/swap/simple/derivedstate-simple-swap-provider'
import { SimpleSwapDeferUntilTokensReady } from 'ui/swap/simple/simple-swap-defer-until-tokens-ready'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DeferUntilWalletReady>
      <CheckerProvider>
        <DerivedstateSimpleSwapProvider>
          <SimpleSwapDeferUntilTokensReady>{children}</SimpleSwapDeferUntilTokensReady>
        </DerivedstateSimpleSwapProvider>
      </CheckerProvider>
    </DeferUntilWalletReady>
  )
}
