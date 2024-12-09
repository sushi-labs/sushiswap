import { getCrossChainSwapEdgeConfig } from './get-cross-chain-swap-edge-config'

import { EdgeProvider } from 'src/providers/edge-config-provider'
import { DerivedstateCrossChainSwapProvider } from 'src/ui/swap/cross-chain/derivedstate-cross-chain-swap-provider'
import { ChainId } from 'sushi/chain'

export async function Providers({
  children,
  chainId,
}: { children: React.ReactNode; chainId: ChainId }) {
  const config = await getCrossChainSwapEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <DerivedstateCrossChainSwapProvider defaultChainId={chainId}>
        {children}
      </DerivedstateCrossChainSwapProvider>
    </EdgeProvider>
  )
}
