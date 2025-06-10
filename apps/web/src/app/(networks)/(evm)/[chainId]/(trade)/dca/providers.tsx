import { EdgeProvider } from 'src/providers/edge-config-provider'
import { DerivedStateTwapProvider } from 'src/ui/swap/twap/derivedstate-twap-provider'
import { getDCAEdgeConfig } from './get-dca-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getDCAEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <DerivedStateTwapProvider>{children}</DerivedStateTwapProvider>
    </EdgeProvider>
  )
}
