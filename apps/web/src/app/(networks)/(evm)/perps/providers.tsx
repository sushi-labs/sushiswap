'use client'

import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/provider'
import { TradeTablesProvider } from './_ui/trade-tables/trade-tables-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CheckerProvider>
      <TradeTablesProvider>{children}</TradeTablesProvider>
    </CheckerProvider>
  )
}
