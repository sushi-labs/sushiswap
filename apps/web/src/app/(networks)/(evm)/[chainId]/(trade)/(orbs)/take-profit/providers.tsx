import { EdgeProvider } from 'src/providers/edge-config-provider'
import { getTakeProfitEdgeConfig } from './get-take-profit-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getTakeProfitEdgeConfig()

  return <EdgeProvider config={config}>{children}</EdgeProvider>
}
