import { getCrossChainSwapEdgeConfig } from './get-cross-chain-swap-edge-config'

import type { LifiXSwapSupportedChainId } from 'src/config'
import { isLifiXSwapSupportedChainId } from 'src/config'
import {
  type NearIntentsSupportedChainId,
  isNearIntentsChainId,
} from 'src/lib/swap/near-intents'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { LifiXSwapProvider } from './_ui/lifi/xswap-provider'
import { NearIntentsXSwapProvider } from './_ui/near-intents/xswap-provider'
import { XSwapFormProvider } from './_ui/xswap-form-provider'

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
        {isLifiXSwapSupportedChainId(chainId) &&
        isNearIntentsChainId(chainId) ? (
          <NearIntentsXSwapProvider>
            <LifiXSwapProvider>{children}</LifiXSwapProvider>
          </NearIntentsXSwapProvider>
        ) : isLifiXSwapSupportedChainId(chainId) ? (
          <LifiXSwapProvider>{children}</LifiXSwapProvider>
        ) : (
          <NearIntentsXSwapProvider>{children}</NearIntentsXSwapProvider>
        )}
      </XSwapFormProvider>
    </EdgeProvider>
  )
}
