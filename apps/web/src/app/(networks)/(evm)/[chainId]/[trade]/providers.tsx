import { HeaderNetworkSelectorProvider } from 'src/lib/wagmi/components/header-network-selector'
import { QuickSelectProvider } from 'src/lib/wagmi/components/token-selector/quick-select/quick-select-provider'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { StrapiBannerProvider } from 'src/ui/swap/strapi-banner/strapi-banner-provider'
import { DerivedstateSimpleTradeProvider } from 'src/ui/swap/trade/derivedstate-simple-trade-provider'
import { SearchProvider } from 'src/ui/swap/trade/search/search-provider'
import { getTradeEdgeConfig } from 'src/ui/swap/trade/trade-edge-config'
import { FuulReferralProvider } from '~evm/_common/ui/fuul-referral-provider'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getTradeEdgeConfig()

  return (
    <CheckerProvider>
      <EdgeProvider config={config}>
        <DerivedstateSimpleTradeProvider>
          <HeaderNetworkSelectorProvider>
            <FuulReferralProvider>
              <StrapiBannerProvider>
                <QuickSelectProvider>
                  <SearchProvider>{children}</SearchProvider>
                </QuickSelectProvider>
              </StrapiBannerProvider>
            </FuulReferralProvider>
          </HeaderNetworkSelectorProvider>
        </DerivedstateSimpleTradeProvider>
      </EdgeProvider>
    </CheckerProvider>
  )
}
