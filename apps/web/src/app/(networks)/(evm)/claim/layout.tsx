import { Container } from '@sushiswap/ui'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { Header } from '~evm/[chainId]/header'
import { Hero } from './hero'
import { NavigationItems } from './navigation-items'

export default function ClaimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header supportedNetworks={SUPPORTED_CHAIN_IDS} />
      <main className="flex flex-col h-full flex-1 animate-slide">
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
    </>
  )
}
