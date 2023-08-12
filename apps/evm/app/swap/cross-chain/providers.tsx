'use client'

import { CheckerProvider } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { DerivedstateCrossChainSwapProvider } from 'ui/swap/cross-chain/derivedstate-cross-chain-swap-provider'
import { DeferUntilWalletReady } from 'ui/swap/defer-until-wallet-ready'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DeferUntilWalletReady>
      <CheckerProvider>
        <DerivedstateCrossChainSwapProvider>{children}</DerivedstateCrossChainSwapProvider>
      </CheckerProvider>
    </DeferUntilWalletReady>
  )
}
