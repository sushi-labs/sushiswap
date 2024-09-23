import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { AptosSidebarContainer, SidebarProvider } from 'src/ui/sidebar'
import { Header } from '../header'
import { Providers } from './providers'

export const metadata = {
  title: 'Pool',
}

export default function PoolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarProvider>
        <Header />
        <AptosSidebarContainer
          shiftContent
          supportedNetworks={POOL_SUPPORTED_NETWORKS}
          unsupportedNetworkHref={'/ethereum/explore/pools'}
        >
          <main className="flex flex-col h-full flex-1">{children}</main>
        </AptosSidebarContainer>
      </SidebarProvider>
    </Providers>
  )
}
