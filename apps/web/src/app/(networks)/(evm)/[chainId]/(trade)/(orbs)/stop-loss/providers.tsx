import { EdgeProvider } from 'src/providers/edge-config-provider'
import { getStopLossEdgeConfig } from './get-stop-loss-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getStopLossEdgeConfig()

  return <EdgeProvider config={config}>{children}</EdgeProvider>
}
