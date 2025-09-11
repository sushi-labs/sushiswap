'use client'

import { ProductNotificationLoader } from '@sushiswap/notifications'
import { useAccount } from 'wagmi'
import { DerivedstateSimpleTradeProvider } from './[chainId]/(trade)/swap/_ui/trade/derivedstate-simple-trade-provider'
import { BalanceProvider } from './_common/ui/balance-provider/balance-provider'
import { PriceProvider } from './_common/ui/price-provider/price-provider/price-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  const { address: account } = useAccount()

  return (
    <PriceProvider>
      {account && <ProductNotificationLoader account={account} />}
      <BalanceProvider>
        <DerivedstateSimpleTradeProvider>
          {children}
        </DerivedstateSimpleTradeProvider>
      </BalanceProvider>
    </PriceProvider>
  )
}
