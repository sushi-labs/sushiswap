import { Container } from '@sushiswap/ui'
import type React from 'react'
import { PoolsFiltersProvider } from 'src/app/(networks)/_ui/pools-filters-provider'
import { Hero } from './hero'

export default function PositionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="flex flex-col h-full flex-1 animate-slide">
        <Container maxWidth="7xl" className="px-4 py-16">
          <Hero />
        </Container>
        <section className="flex flex-col flex-1">
          <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-20 h-full">
            <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
          </div>
        </section>
      </main>
    </>
  )
}
