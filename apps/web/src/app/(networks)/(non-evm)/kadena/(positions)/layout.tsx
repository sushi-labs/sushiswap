import { Container } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { PoolsFiltersProvider } from 'src/ui/pool'
import { Header } from '../header'
import { Hero } from './hero'
import { NavigationItems } from './navigation-items'

export const metadata: Metadata = {
  title: 'My Positions',
  description:
    'Manage your liquidity on SushiSwap: add or remove liquidity, track all your positions and claim fees.',
}

export default function PositionsLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-col flex-1 h-full animate-slide">
        <Container maxWidth="7xl" className="px-4 py-16">
          <Hero />
        </Container>
        <Container maxWidth="7xl" className="flex gap-2 px-4 pb-4">
          <NavigationItems />
        </Container>
        <section className="flex flex-col flex-1">
          <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10 h-full">
            <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
          </div>
        </section>
      </main>
    </>
  )
}
