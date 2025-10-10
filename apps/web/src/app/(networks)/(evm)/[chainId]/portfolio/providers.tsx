import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/provider'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { TablesProvider } from 'src/ui/portfolio/tables-view/table-context'
import { SendTokensProvider } from 'src/ui/portfolio/wallet-holdings/send-token-provider'
import { DerivedstateSimpleSwapProvider } from '../[trade]/_ui/swap/derivedstate-simple-swap-provider'
import { TradeTablesProvider } from '../[trade]/_ui/swap/trade/tab-tables/trade-tables-context'
import { getTradeEdgeConfig } from '../[trade]/_ui/swap/trade/trade-edge-config'
import { ChartFiltersProvider } from './chart-filters-provider'
import { LPPositionProvider } from './lp-position-provider'
import { WalletFiltersProvider } from './wallet-filters-provider'

export const Providers = async ({
  children,
}: { children: React.ReactNode }) => {
  const config = await getTradeEdgeConfig()

  return (
    <CheckerProvider>
      <EdgeProvider config={config}>
        <DerivedstateSimpleSwapProvider>
          <SendTokensProvider>
            <WalletFiltersProvider>
              <ChartFiltersProvider>
                <LPPositionProvider>
                  <TradeTablesProvider>
                    <TablesProvider>{children}</TablesProvider>
                  </TradeTablesProvider>
                </LPPositionProvider>
              </ChartFiltersProvider>
            </WalletFiltersProvider>
          </SendTokensProvider>
        </DerivedstateSimpleSwapProvider>
      </EdgeProvider>
    </CheckerProvider>
  )
}
