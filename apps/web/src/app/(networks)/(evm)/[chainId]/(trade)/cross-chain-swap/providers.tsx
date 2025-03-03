import { getCrossChainSwapEdgeConfig } from './get-cross-chain-swap-edge-config'

import { EdgeProvider } from 'src/providers/edge-config-provider'
import { DerivedstateCrossChainSwapUrlProvider } from 'src/ui/swap/cross-chain/derivedstate-cross-chain-swap-url-provider'
import type { EvmChainId } from 'sushi/chain'

export async function Providers({
  children,
  chainId,
}: { children: React.ReactNode; chainId: EvmChainId }) {
  const config = await getCrossChainSwapEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <DerivedstateCrossChainSwapUrlProvider defaultChainId={chainId}>
        {children}
      </DerivedstateCrossChainSwapUrlProvider>
    </EdgeProvider>
  )
}
