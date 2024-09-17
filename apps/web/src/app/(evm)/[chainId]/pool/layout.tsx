import { PoolChainIds, isPoolChainId } from '@sushiswap/graph-client/data-api'
import { SidebarContainer, SidebarProvider } from 'src/ui/sidebar'
import { ChainId, NonStandardChainId } from 'sushi/chain'
import { Header } from '../header'
import notFound from '../not-found'

const sidebarNetworks = [...PoolChainIds, NonStandardChainId.APTOS] as const

export default function PoolLayout({
  children,
  params,
}: { children: React.ReactNode; params: { chainId: string } }) {
  const chainId = +params.chainId as ChainId
  if (!isPoolChainId(chainId)) {
    return notFound()
  }

  return (
    <SidebarProvider>
      <Header />
      <SidebarContainer
        shiftContent
        supportedNetworks={sidebarNetworks}
        unsupportedNetworkHref={'/ethereum/explore/pools'}
      >
        <main className="flex flex-col h-full flex-1">{children}</main>
      </SidebarContainer>
    </SidebarProvider>
  )
}
