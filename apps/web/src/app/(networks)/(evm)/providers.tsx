'use client'

import { FuulProvider } from 'src/providers/fuul-provider'
import { BalanceProvider } from './_common/ui/balance-provider/balance-provider'
import { PriceProvider } from './_common/ui/price-provider/price-provider/price-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FuulProvider>
      <PriceProvider>
        <BalanceProvider>{children}</BalanceProvider>
      </PriceProvider>
    </FuulProvider>
  )
}
