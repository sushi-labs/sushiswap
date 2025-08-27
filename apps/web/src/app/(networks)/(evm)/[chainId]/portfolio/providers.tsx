import { QuickSelectProvider } from 'src/lib/wagmi/components/token-selector/quick-select/quick-select-provider'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { SendTokensProvider } from 'src/ui/portfolio/wallet-holdings/send-token-provider'
import { DerivedstateSimpleSwapProvider } from 'src/ui/swap/simple/derivedstate-simple-swap-provider'
import { getTradeEdgeConfig } from 'src/ui/swap/trade/trade-edge-config'

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
          <SendTokensProvider>{children}</SendTokensProvider>
        </DerivedstateSimpleSwapProvider>
      </EdgeProvider>
    </CheckerProvider>
  )
}
