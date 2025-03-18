import { Container } from '@sushiswap/ui'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { EvmChainId } from 'sushi/chain'
import { Header } from '~evm/[chainId]/header'
import { SidebarContainer, SidebarProvider } from '~evm/_common/ui/sidebar'
import { Hero } from './hero'
import { NavigationItems } from './navigation-items'

const supportedNetworks = [EvmChainId.ETHEREUM]

export default function ClaimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Header chainId={EvmChainId.ETHEREUM} />
      <SidebarContainer
        shiftContent
        selectedNetwork={EvmChainId.ETHEREUM}
        supportedNetworks={supportedNetworks}
        onSelect={null}
      >
        <main className="flex flex-col h-full flex-1">
          <Container maxWidth="7xl" className="px-4 pt-16 pb-8">
            <Hero />
          </Container>
          <Container maxWidth="7xl" className="px-4 flex gap-2 pb-4">
            <NavigationItems />
          </Container>
          <section className="flex flex-col flex-1">
            <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10 min-h-screen">
              {children}
            </div>
          </section>
        </main>
      </SidebarContainer>
    </SidebarProvider>
  )
}
