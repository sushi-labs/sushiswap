import { getCrossChainSwapEdgeConfig } from './get-cross-chain-swap-edge-config'

import type { LifiXSwapSupportedChainId } from 'src/config'
import type { NearIntentsSupportedChainId } from 'src/lib/swap/near-intents'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { LifiXSwapProvider } from './_ui/lifi/xswap-provider'
import { XSwapFormProvider } from './_ui/xswap-form-provider'
import { XSwapRoutingProvider } from './_ui/xswap-routing-provider'

export async function Providers({
  children,
  chainId,
}: {
  children: React.ReactNode
  chainId: LifiXSwapSupportedChainId | NearIntentsSupportedChainId
}) {
  const config = await getCrossChainSwapEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <XSwapFormProvider defaultChainId={chainId}>
        <LifiXSwapProvider>
          <XSwapRoutingProvider>{children}</XSwapRoutingProvider>
        </LifiXSwapProvider>
      </XSwapFormProvider>
    </EdgeProvider>
  )
}
