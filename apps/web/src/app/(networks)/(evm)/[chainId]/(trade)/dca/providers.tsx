import { EdgeProvider } from 'src/providers/edge-config-provider'
import { DerivedstateSimpleSwapUrlProvider } from 'src/ui/swap/simple/derivedstate-simple-swap-url-provider'
import { getDCAEdgeConfig } from './get-dca-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getDCAEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <DerivedstateSimpleSwapUrlProvider>
        {children}
      </DerivedstateSimpleSwapUrlProvider>
    </EdgeProvider>
  )
}
