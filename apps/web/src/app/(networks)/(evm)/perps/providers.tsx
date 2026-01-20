'use client'

import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/provider'
import { AssetListProvider } from './_ui/asset-list-provider'
import { AssetSelectorStateProvider } from './_ui/asset-selector/asset-selector-provider'
import { AssetStateProvider } from './_ui/asset-state-provider'
import { TradeTablesProvider } from './_ui/trade-tables/trade-tables-provider'
import { UserProvider } from './user-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CheckerProvider>
      <AssetListProvider>
        <AssetStateProvider>
          <AssetSelectorStateProvider>
            <TradeTablesProvider>
              <UserProvider>{children}</UserProvider>
            </TradeTablesProvider>
          </AssetSelectorStateProvider>
        </AssetStateProvider>
      </AssetListProvider>
    </CheckerProvider>
  )
}
