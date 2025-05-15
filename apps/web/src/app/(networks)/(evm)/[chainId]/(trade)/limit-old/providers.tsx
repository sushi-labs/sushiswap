import { EdgeProvider } from 'src/providers/edge-config-provider'
import { DerivedStateTwapProvider } from 'src/ui/swap/twap/derivedstate-twap-provider'
import { getLimitEdgeConfig } from './get-limit-edge-config'

export async function Providers({ children }: { children: React.ReactNode }) {
  const config = await getLimitEdgeConfig()

  return (
    <EdgeProvider config={config}>
      <DerivedStateTwapProvider isLimitOrder>
        {children}
      </DerivedStateTwapProvider>
    </EdgeProvider>
  )
}
