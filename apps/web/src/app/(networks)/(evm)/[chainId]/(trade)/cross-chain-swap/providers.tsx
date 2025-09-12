import { getCrossChainSwapEdgeConfig } from './get-cross-chain-swap-edge-config'

import { EdgeProvider } from 'src/providers/edge-config-provider'
import type { EvmChainId } from 'sushi/evm'
import { DerivedstateCrossChainSwapProvider } from './_ui/derivedstate-cross-chain-swap-provider'

export async function Providers({
  children,
  chainId,
}: { children: React.ReactNode; chainId: EvmChainId }) {
  const config = await getCrossChainSwapEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <DerivedstateCrossChainSwapProvider defaultChainId={chainId}>
        {children}
      </DerivedstateCrossChainSwapProvider>
    </EdgeProvider>
  )
}
