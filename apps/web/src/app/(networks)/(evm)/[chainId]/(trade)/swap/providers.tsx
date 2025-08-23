import { EdgeProvider } from 'src/providers/edge-config-provider'
import { DerivedstateSimpleSwapProvider } from 'src/ui/swap/simple/derivedstate-simple-swap-provider'
import { StrapiBannerProvider } from 'src/ui/swap/strapi-banner/strapi-banner-provider'
import { getSwapEdgeConfig } from './get-swap-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getSwapEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <DerivedstateSimpleSwapProvider>
        <StrapiBannerProvider>{children}</StrapiBannerProvider>
      </DerivedstateSimpleSwapProvider>
    </EdgeProvider>
  )
}
