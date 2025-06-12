import { Container } from '@sushiswap/ui'
import { PoolsFiltersProvider } from 'src/ui/pool'
import { Header } from '../header'
import { Hero } from './hero'
import { NavigationItems } from './navigation-items'

export default function PositionsLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Header className="mb-16" />

      <main className="flex flex-col h-full flex-1">
        <Container maxWidth="7xl" className="px-4 py-16">
          <Hero />
        </Container>
        <Container maxWidth="7xl" className="px-4 flex gap-2 pb-4">
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
