import { EdgeProvider } from 'src/providers/edge-config-provider'
// import { StrapiBannerProvider } from './_ui/strapi-banner/strapi-banner-provider'
import { getSwapEdgeConfig } from './get-swap-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getSwapEdgeConfig()

  // StrapiBannerProvider disabled: unused for a while, and its cookies() read
  // wrapped `children`, making the whole swap subtree request-bound.
  return <EdgeProvider config={config}>{children}</EdgeProvider>
}
