import { EdgeProvider } from 'src/providers/edge-config-provider'
import { getSwapEdgeConfig } from '~evm/[chainId]/(trade)/swap-old/get-swap-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getSwapEdgeConfig()

  return <EdgeProvider config={config}>{children}</EdgeProvider>
}
