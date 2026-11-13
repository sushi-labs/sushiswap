'use client'

import { type ComponentProps, type ReactElement, use } from 'react'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { CrossChainSwapWidget } from '../../cross-chain-swap/_ui/cross-chain-swap-widget'
import { LifiXSwapProvider } from '../../cross-chain-swap/_ui/lifi/xswap-provider'
import { XSwapFormProvider } from '../../cross-chain-swap/_ui/xswap-form-provider'
import { XSwapRoutingProvider } from '../../cross-chain-swap/_ui/xswap-routing-provider'
import type { SwapEdgeConfig } from '../swap-edge-config'

interface UnifiedCrossChainSwapRuntimeProps {
  chainId: ComponentProps<typeof XSwapFormProvider>['defaultChainId']
  config: Promise<SwapEdgeConfig>
}

export function UnifiedCrossChainSwapRuntime({
  chainId,
  config,
}: UnifiedCrossChainSwapRuntimeProps): ReactElement {
  const crossChainConfig = use(config)

  return (
    <EdgeProvider config={crossChainConfig}>
      <XSwapFormProvider defaultChainId={chainId} unified>
        <LifiXSwapProvider>
          <XSwapRoutingProvider>
            <CrossChainSwapWidget />
          </XSwapRoutingProvider>
        </LifiXSwapProvider>
      </XSwapFormProvider>
    </EdgeProvider>
  )
}
