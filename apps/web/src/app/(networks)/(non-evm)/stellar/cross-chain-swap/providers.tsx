'use client'

import { BalanceProvider } from '~evm/_common/ui/balance-provider/balance-provider'
import { PriceProvider } from '~evm/_common/ui/price-provider/price-provider/price-provider'
import { DerivedstateCrossChainSwapProvider } from './_ui/derivedstate-cross-chain-swap-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DerivedstateCrossChainSwapProvider>
      <PriceProvider>
        <BalanceProvider>{children}</BalanceProvider>
      </PriceProvider>
    </DerivedstateCrossChainSwapProvider>
  )
}
