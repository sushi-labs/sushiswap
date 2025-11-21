import { QuickSelectProvider } from 'src/lib/wagmi/components/token-selector/quick-select/quick-select-provider'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/provider'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { DerivedStateFiatProvider } from './_ui/swap/fiat/derivedstate-fiat-provider'
import { StrapiBannerProvider } from './_ui/swap/strapi-banner/strapi-banner-provider'
import { SearchProvider } from './_ui/swap/trade/search/search-provider'
import { getTradeEdgeConfig } from './_ui/swap/trade/trade-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getTradeEdgeConfig()

  return (
    <CheckerProvider>
      <EdgeProvider config={config}>
        <DerivedStateFiatProvider>
          <StrapiBannerProvider>
            <QuickSelectProvider>
              <SearchProvider>{children}</SearchProvider>
            </QuickSelectProvider>
          </StrapiBannerProvider>
        </DerivedStateFiatProvider>
      </EdgeProvider>
    </CheckerProvider>
  )
}
