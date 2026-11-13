import { Container } from '@sushiswap/ui'
import { type ReactElement, Suspense } from 'react'
import type { UnifiedSwapChainId } from 'src/lib/swap/unified-swap'
import { getCrossChainSwapEdgeConfig } from '../cross-chain-swap/get-cross-chain-swap-edge-config'
import { SimpleSwapWidgetFrame } from './_ui/simple-swap-widget-frame'
import { SimpleSwapWidgetSkeleton } from './_ui/simple-swap-widget-skeleton'
import { UnifiedSwapRuntime } from './_ui/unified-swap-runtime'
import { getSwapEdgeConfig } from './get-swap-edge-config'

async function ConfiguredSwap({
  chainId,
}: { chainId: UnifiedSwapChainId }): Promise<ReactElement> {
  const swapConfig = await getSwapEdgeConfig()
  // Only cross-chain mode waits for its live maintenance configuration.
  const crossChainConfig = getCrossChainSwapEdgeConfig()
    .then((config) => config ?? { maintenance: true })
    .catch(() => ({ maintenance: true }))
  return (
    <UnifiedSwapRuntime
      defaultChainId={chainId}
      swapConfig={swapConfig}
      crossChainConfig={crossChainConfig}
    />
  )
}

export function UnifiedSwap({
  chainId,
}: { chainId: UnifiedSwapChainId }): ReactElement {
  return (
    <Container maxWidth="xl">
      <Suspense
        fallback={
          <SimpleSwapWidgetFrame chainId={chainId}>
            <SimpleSwapWidgetSkeleton chainId={chainId} />
          </SimpleSwapWidgetFrame>
        }
      >
        <ConfiguredSwap chainId={chainId} />
      </Suspense>
    </Container>
  )
}
