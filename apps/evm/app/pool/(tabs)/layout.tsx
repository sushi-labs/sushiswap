import React from '@sushiswap/prettier-config/dist/react'
import { Container } from '@sushiswap/ui'
import Link from 'next/link'

import { PathnameButton, PoolsFiltersProvider } from '../../../ui/pool'
import { Hero } from '../hero'

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Container maxWidth="7xl" className="px-4 pt-20 pb-10">
        <Hero />
      </Container>
      <Container maxWidth="7xl" className="px-4">
        <div className="flex items-center gap-2 mb-4">
          <Link shallow={true} href={`/pool/`}>
            <PathnameButton pathname={`/pool`} asChild size="sm">
              All Pools
            </PathnameButton>
          </Link>
          <Link shallow={true} href={`/pool/my-positions`}>
            <PathnameButton pathname={`/pool/my-positions`} asChild size="sm">
              My Positions
            </PathnameButton>
          </Link>
          <Link shallow={true} href={`/pool/my-rewards`}>
            <PathnameButton pathname={`/pool/my-rewards`} asChild size="sm">
              My Rewards
            </PathnameButton>
          </Link>
          <Link shallow={true} href={`/pool/migrate`}>
            <PathnameButton pathname={`/pool/migrate`} asChild size="sm">
              Migrate
            </PathnameButton>
          </Link>
        </div>
      </Container>
      <section className="flex flex-col flex-1">
        <div className="bg-gray-50 dark:bg-white/[0.02] pt-4 pb-20 h-full">
          <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
        </div>
      </section>
    </>
  )
}
