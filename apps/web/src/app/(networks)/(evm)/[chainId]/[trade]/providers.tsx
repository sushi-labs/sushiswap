import { HeaderNetworkSelectorProvider } from 'src/lib/wagmi/components/header-network-selector'
import { QuickSelectProvider } from 'src/lib/wagmi/components/token-selector/quick-select/quick-select-provider'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/provider'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { DerivedStateFiatProvider } from '../(trade)/swap/_ui/fiat/derivedstate-fiat-provider'
import { StrapiBannerProvider } from '../(trade)/swap/_ui/strapi-banner/strapi-banner-provider'
import { SearchProvider } from '../(trade)/swap/_ui/trade/search/search-provider'
import { getTradeEdgeConfig } from '../(trade)/swap/_ui/trade/trade-edge-config'

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
