import { EdgeProvider } from 'src/providers/edge-config-provider'
import { DerivedstateSimpleSwapUrlProvider } from 'src/ui/swap/simple/derivedstate-simple-swap-url-provider'
import { FuulReferralProvider } from '~evm/_common/ui/fuul-referral-provider'
import { getSwapEdgeConfig } from './get-swap-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getSwapEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <DerivedstateSimpleSwapUrlProvider>
        <FuulReferralProvider>{children}</FuulReferralProvider>
      </DerivedstateSimpleSwapUrlProvider>
    </EdgeProvider>
  )
}
