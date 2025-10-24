import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/provider'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { TablesProvider } from '~evm/[chainId]/portfolio/_ui/tables-view/table-context'
import { SendTokensProvider } from '~evm/[chainId]/portfolio/_ui/wallet-holdings/send-token-provider'
import { DerivedstateSimpleSwapProvider } from '../[trade]/_ui/swap/derivedstate-simple-swap-provider'
import { TradeTablesProvider } from '../[trade]/_ui/swap/trade/tab-tables/trade-tables-context'
// import { getTradeEdgeConfig } from '../[trade]/_ui/swap/trade/trade-edge-config'
import { ChartFiltersProvider } from './chart-filters-provider'
import { LPPositionProvider } from './lp-position-provider'
import { WalletFiltersProvider } from './wallet-filters-provider'

export const Providers = async ({
  children,
}: { children: React.ReactNode }) => {
  //@dev @todo aws is down atm and this is throwing an error
  // const config = await getTradeEdgeConfig()

  return (
    <CheckerProvider>
      <EdgeProvider config={'swap'}>
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
