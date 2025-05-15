import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import { EdgeProvider } from 'src/providers/edge-config-provider';
import { StrapiBannerProvider } from 'src/ui/swap/strapi-banner/strapi-banner-provider'
import { FuulReferralProvider } from '~evm/_common/ui/fuul-referral-provider'
import { getTradeEdgeConfig } from 'src/ui/swap/trade/trade-edge-config';
import { DerivedstateSimpleTradeProvider } from 'src/ui/swap/trade/derivedstate-simple-trade-provider';
import { HeaderNetworkSelectorProvider } from 'src/lib/wagmi/components/header-network-selector';

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getTradeEdgeConfig()

  return (
    <CheckerProvider>
      <EdgeProvider config={config}>
        <DerivedstateSimpleTradeProvider>
          <HeaderNetworkSelectorProvider>
            <FuulReferralProvider>
              <StrapiBannerProvider>
                {children}
              </StrapiBannerProvider>
            </FuulReferralProvider>
          </HeaderNetworkSelectorProvider>
        </DerivedstateSimpleTradeProvider>
      </EdgeProvider>
    </CheckerProvider>
  )
}
