import { PoolChainIds } from '@sushiswap/graph-client/data-api'
import { NonStandardChainId } from 'src/config'
import { AptosSidebarContainer, SidebarProvider } from 'src/ui/sidebar'
import { Header } from '../header'
import { Providers } from './providers'

export const metadata = {
  title: 'Pool',
}

const sidebarNetworks = [...PoolChainIds, NonStandardChainId.APTOS] as const

export default function PoolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarProvider>
        <Header />
        <AptosSidebarContainer
          shiftContent
          supportedNetworks={sidebarNetworks}
          unsupportedNetworkHref={'/ethereum/explore/pools'}
        >
          <main className="flex flex-col h-full flex-1">{children}</main>
        </AptosSidebarContainer>
      </SidebarProvider>
    </Providers>
  )
}
