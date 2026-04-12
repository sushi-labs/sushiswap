'use client'

import { AutoApplyInvite } from 'src/lib/perps/use-auto-apply-invite'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/provider'
import { UserSettingsProvider } from './_ui/account-management'
import {
  AssetListProvider,
  AssetSelectorStateProvider,
} from './_ui/asset-selector'
import { TradeTablesProvider } from './_ui/trade-tables'
import { AssetStateProvider } from './_ui/trade-widget'
import { UserProvider } from './user-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CheckerProvider>
      <AssetListProvider>
        <AssetSelectorStateProvider>
          <TradeTablesProvider>
            <UserProvider>
              <AutoApplyInvite />
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
