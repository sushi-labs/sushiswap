import { getSwapEdgeConfig } from '~stellar/_common/lib/edge/get-swap-edge-config'
import { EdgeProvider } from '~stellar/_common/providers/edge-config-provider'
import { SimpleSwapProvider } from '~stellar/_common/ui/Swap/simple/simple-swap-provider/simple-swap-provider'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getSwapEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <SimpleSwapProvider>{children}</SimpleSwapProvider>
    </EdgeProvider>
  )
}
