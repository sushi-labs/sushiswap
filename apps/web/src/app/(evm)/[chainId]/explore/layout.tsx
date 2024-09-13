import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { isSteerChainId } from '@sushiswap/steer-sdk'
import { Container } from '@sushiswap/ui'
import { LinkInternal } from '@sushiswap/ui'
import { notFound } from 'next/navigation'

import React from 'react'
import { GlobalStatsCharts } from 'src/ui/explore/global-stats-charts'
import { PathnameButton } from 'src/ui/pathname-button'
import { PoolsFiltersProvider } from 'src/ui/pool'
import { ChainId, ChainKey } from 'sushi/chain'

export const metadata = {
  title: 'Pools 💦',
}

export default async function ExploreLayout({
  children,
  params,
}: { children: React.ReactNode; params: { chainId: string } }) {
  const chainId = +params.chainId as ChainId

  if (!isPoolChainId(chainId)) {
    return notFound()
  }

  return (
    <>
      <Container maxWidth="7xl" className="px-4 py-4">
        <GlobalStatsCharts chainId={chainId} />
      </Container>
      <section className="flex flex-col min-h-screen">
        <Container maxWidth="7xl" className="px-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <LinkInternal
              shallow={true}
              scroll={false}
              href={`/${ChainKey[chainId]}/explore/pools`}
            >
              <PathnameButton
                id="all-pools"
                pathname={`/${ChainKey[chainId]}/explore/pools`}
                asChild
                size="sm"
              >
                All Pools
              </PathnameButton>
            </LinkInternal>
            {isSteerChainId(chainId) ? (
              <LinkInternal
                shallow={true}
                scroll={false}
                href={`/${ChainKey[chainId]}/explore/smart-pools`}
              >
                <PathnameButton
                  id="smart-pools"
                  pathname={`/${ChainKey[chainId]}/explore/smart-pools`}
                  asChild
                  size="sm"
                >
                  Smart Pools
                </PathnameButton>
              </LinkInternal>
            ) : (
              <PathnameButton pathname="" size="sm" disabled>
                Smart Pools
              </PathnameButton>
            )}
          </div>
        </Container>
        <div className="flex-1 bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-20">
          <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
        </div>
      </section>
    </>
  )
}
