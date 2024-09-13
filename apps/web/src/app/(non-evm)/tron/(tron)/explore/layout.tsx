import { Container } from '@sushiswap/ui'
import { LinkInternal } from '@sushiswap/ui'

import React from 'react'
import { GlobalStatsCharts } from 'src/ui/explore/global-stats-charts'
import { PathnameButton } from 'src/ui/pathname-button'
import { PoolsFiltersProvider } from 'src/ui/pool'

export const metadata = {
  title: 'Pools 💦',
}

export default async function ExploreLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Container maxWidth="7xl" className="px-4 py-4">
        THIS IS THE ETHEREUM CHART FIX IT
        <GlobalStatsCharts chainId={1} />
      </Container>
      <section className="flex flex-col min-h-screen">
        <Container maxWidth="7xl" className="px-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <LinkInternal
              shallow={true}
              scroll={false}
              href={`/tron/explore/pools`}
            >
              <PathnameButton
                id="all-pools"
                pathname={`/tron/explore/pools`}
                asChild
                size="sm"
              >
                All Pools
              </PathnameButton>
            </LinkInternal>
          </div>
        </Container>
        <div className="flex-1 bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-20">
          <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
        </div>
      </section>
    </>
  )
}
