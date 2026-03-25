import { EdgeProvider } from 'src/providers/edge-config-provider'
import { getDCAEdgeConfig } from './get-dca-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getDCAEdgeConfig()

  return <EdgeProvider config={config}>{children}</EdgeProvider>
}
