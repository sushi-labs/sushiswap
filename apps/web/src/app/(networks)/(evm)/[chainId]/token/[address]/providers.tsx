import { EdgeProvider } from 'src/providers/edge-config-provider'
import { getTradeEdgeConfig } from '~evm/[chainId]/[trade]/_ui/swap/trade/trade-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = (await getTradeEdgeConfig())['swap']

  return <EdgeProvider config={config}>{children}</EdgeProvider>
}
