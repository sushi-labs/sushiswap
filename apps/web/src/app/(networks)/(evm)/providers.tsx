'use client'

import { ProductNotificationLoader } from '@sushiswap/notifications'
import { DerivedstateSimpleTradeProvider } from 'src/ui/swap/trade/derivedstate-simple-trade-provider'
import { useAccount } from 'wagmi'
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
