import { getCrossChainSwapEdgeConfig } from './get-cross-chain-swap-edge-config'

import type { XSwapSupportedChainId } from 'src/config'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { XSwapFormProvider } from './_ui/xswap-form-provider'
import { LifiXSwapProvider } from './_ui/lifi-xswap-provider'

export async function Providers({
  children,
  chainId,
}: { children: React.ReactNode; chainId: XSwapSupportedChainId }) {
  const config = await getCrossChainSwapEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <XSwapFormProvider defaultChainId={chainId}>
        <LifiXSwapProvider>
          {children}
        </LifiXSwapProvider>
      </XSwapFormProvider>
    </EdgeProvider>
  )
}
