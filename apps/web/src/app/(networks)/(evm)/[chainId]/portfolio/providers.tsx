import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/provider'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { SendTokensProvider } from 'src/ui/portfolio/wallet-holdings/send-token-provider'
import { DerivedstateSimpleSwapProvider } from '../[trade]/_ui/swap/derivedstate-simple-swap-provider'
import { getTradeEdgeConfig } from '../[trade]/_ui/swap/trade/trade-edge-config'
import { ChartFiltersProvider } from './chart-filters-provider'
import { WalletFiltersProvider } from './wallet-filters-provider'

export const Providers = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const config = await getTradeEdgeConfig()

  return (
    <CheckerProvider>
      <EdgeProvider config={config}>
        <DerivedstateSimpleSwapProvider>
          <SendTokensProvider>
            <WalletFiltersProvider>
              <ChartFiltersProvider>{children}</ChartFiltersProvider>
            </WalletFiltersProvider>
          </SendTokensProvider>
        </DerivedstateSimpleSwapProvider>
      </EdgeProvider>
    </CheckerProvider>
  )
}
