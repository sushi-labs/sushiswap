'use client'

import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/provider'
import { UserSettingsProvider } from './_ui/account-management/settings-provider'
import { AssetListProvider } from './_ui/asset-selector/asset-list-provider'
import { AssetSelectorStateProvider } from './_ui/asset-selector/asset-selector-provider'
import { TradeTablesProvider } from './_ui/trade-tables/trade-tables-provider'
import { AssetStateProvider } from './_ui/trade-widget/asset-state-provider'
import { UserProvider } from './user-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CheckerProvider>
      <AssetListProvider>
        <AssetSelectorStateProvider>
          <TradeTablesProvider>
            <UserProvider>
              <UserSettingsProvider>
                <AssetStateProvider>{children}</AssetStateProvider>
              </UserSettingsProvider>
            </UserProvider>
          </TradeTablesProvider>
        </AssetSelectorStateProvider>
      </AssetListProvider>
    </CheckerProvider>
  )
}
