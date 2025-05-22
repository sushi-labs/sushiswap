import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { StrapiBannerProvider } from 'src/ui/swap/strapi-banner/strapi-banner-provider'
import { DerivedstateTradeProvider } from 'src/ui/swap/trade/derivedstate-trade-provider'
import { getTradeEdgeConfig } from 'src/ui/swap/trade/trade-edge-config'
import { FuulReferralProvider } from '~evm/_common/ui/fuul-referral-provider'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getTradeEdgeConfig()

  return (
    <CheckerProvider>
      <EdgeProvider config={config}>
        <DerivedstateTradeProvider>
          <FuulReferralProvider>
            <StrapiBannerProvider>{children}</StrapiBannerProvider>
          </FuulReferralProvider>
        </DerivedstateTradeProvider>
      </EdgeProvider>
    </CheckerProvider>
  )
}
