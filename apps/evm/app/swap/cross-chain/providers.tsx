'use client'

import { CheckerProvider } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { CrossChainSwapDeferUntilTokensReady } from 'ui/swap/cross-chain/cross-chain-swap-defer-until-tokens-ready'
import { DerivedstateCrossChainSwapProvider } from 'ui/swap/cross-chain/derivedstate-cross-chain-swap-provider'
import { DeferUntilWalletReady } from 'ui/swap/defer-until-wallet-ready'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DeferUntilWalletReady>
      <CheckerProvider>
        <DerivedstateCrossChainSwapProvider>
          <CrossChainSwapDeferUntilTokensReady>{children}</CrossChainSwapDeferUntilTokensReady>
        </DerivedstateCrossChainSwapProvider>
      </CheckerProvider>
    </DeferUntilWalletReady>
  )
}
