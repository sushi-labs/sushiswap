import { getSwapEdgeConfig } from 'lib/edge/get-swap-edge-config'
import { EdgeProvider } from 'providers/edge-config-provider'
import { SimpleSwapProvider } from '../../ui/swap/simple/simple-swap-provider/simple-swap-provider'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getSwapEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <SimpleSwapProvider>{children}</SimpleSwapProvider>
    </EdgeProvider>
  )
}
