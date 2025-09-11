import { HeaderNetworkSelectorProvider } from 'src/lib/wagmi/components/header-network-selector'
import { QuickSelectProvider } from 'src/lib/wagmi/components/token-selector/quick-select/quick-select-provider'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { DerivedStateFiatProvider } from 'src/ui/swap/fiat/derivedstate-fiat-provider'
import { StrapiBannerProvider } from 'src/ui/swap/strapi-banner/strapi-banner-provider'
import { SearchProvider } from 'src/ui/swap/trade/search/search-provider'
import { getTradeEdgeConfig } from 'src/ui/swap/trade/trade-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getTradeEdgeConfig()

  return (
    <CheckerProvider>
      <EdgeProvider config={config}>
        <DerivedStateFiatProvider>
          <HeaderNetworkSelectorProvider>
            <StrapiBannerProvider>
              <QuickSelectProvider>
                <SearchProvider>{children}</SearchProvider>
              </QuickSelectProvider>
            </StrapiBannerProvider>
          </HeaderNetworkSelectorProvider>
        </DerivedStateFiatProvider>
      </EdgeProvider>
    </CheckerProvider>
  )
}
