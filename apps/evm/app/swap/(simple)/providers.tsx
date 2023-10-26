import { getSwapEdgeConfig } from 'lib/edge/get-swap-edge-config'
import { EdgeProvider } from 'providers/edge-config-provider'
import { DerivedstateSimpleSwapProvider } from 'ui/swap/simple/derivedstate-simple-swap-provider'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getSwapEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <DerivedstateSimpleSwapProvider>
        {children}
      </DerivedstateSimpleSwapProvider>
    </EdgeProvider>
  )
}
