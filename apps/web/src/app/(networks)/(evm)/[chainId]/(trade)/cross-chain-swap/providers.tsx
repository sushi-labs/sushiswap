import { getCrossChainSwapEdgeConfig } from './get-cross-chain-swap-edge-config'

import type { XSwapSupportedChainId } from 'src/config'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { DerivedstateCrossChainSwapProvider } from './_ui/derivedstate-cross-chain-swap-provider'

export async function Providers({
  children,
  chainId,
}: { children: React.ReactNode; chainId: XSwapSupportedChainId }) {
  const config = await getCrossChainSwapEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <DerivedstateCrossChainSwapProvider defaultChainId={chainId}>
        {children}
      </DerivedstateCrossChainSwapProvider>
    </EdgeProvider>
  )
}
