'use client'

import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/provider'
import { AssetListProvider } from './_ui/asset-list-provider'
import { PerpStateProvider } from './_ui/perp-state-provider'
import { TradeTablesProvider } from './_ui/trade-tables/trade-tables-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CheckerProvider>
      <AssetListProvider>
        <PerpStateProvider>
          <TradeTablesProvider>{children}</TradeTablesProvider>
        </PerpStateProvider>
      </AssetListProvider>
    </CheckerProvider>
  )
}
