import { ChainId } from 'sushi'
import LaunchpadLayout from '../[chainId]/launchpad/layout'
import { Providers } from '../[chainId]/providers'

const params = Promise.resolve({ chainId: ChainId.ROBINHOOD.toString() })

export default function LaunchLayout({
  children,
}: { children: React.ReactNode }): React.ReactElement {
  return (
    <Providers>
      <LaunchpadLayout params={params}>{children}</LaunchpadLayout>
    </Providers>
  )
}
