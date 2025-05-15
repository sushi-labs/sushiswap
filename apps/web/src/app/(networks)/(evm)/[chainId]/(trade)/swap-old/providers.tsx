import { EdgeProvider } from 'src/providers/edge-config-provider'
import { DerivedstateSimpleSwapProvider } from 'src/ui/swap/simple/derivedstate-simple-swap-provider'
import { StrapiBannerProvider } from 'src/ui/swap/strapi-banner/strapi-banner-provider'
import { FuulReferralProvider } from '~evm/_common/ui/fuul-referral-provider'
import { getSwapEdgeConfig } from './get-swap-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getSwapEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <DerivedstateSimpleSwapProvider>
        <FuulReferralProvider>
          <StrapiBannerProvider>{children}</StrapiBannerProvider>
        </FuulReferralProvider>
      </DerivedstateSimpleSwapProvider>
    </EdgeProvider>
  )
}
