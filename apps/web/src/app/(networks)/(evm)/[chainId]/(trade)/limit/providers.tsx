import { EdgeProvider } from 'src/providers/edge-config-provider'
import { DerivedstateSimpleSwapUrlProvider } from 'src/ui/swap/simple/derivedstate-simple-swap-url-provider'
import { getLimitEdgeConfig } from './get-limit-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getLimitEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <DerivedstateSimpleSwapUrlProvider>
        {children}
      </DerivedstateSimpleSwapUrlProvider>
    </EdgeProvider>
  )
}
