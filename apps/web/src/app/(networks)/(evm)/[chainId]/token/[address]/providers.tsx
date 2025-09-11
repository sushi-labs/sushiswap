import { EdgeProvider } from 'src/providers/edge-config-provider'
import { getTradeEdgeConfig } from '~evm/[chainId]/(trade)/swap/_ui/trade/trade-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = (await getTradeEdgeConfig())['swap']

  return <EdgeProvider config={config}>{children}</EdgeProvider>
}
