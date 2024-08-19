import { isSteerChainId } from '@sushiswap/steer-sdk'
import { Container } from '@sushiswap/ui'
import { LinkInternal } from '@sushiswap/ui'

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
  return (
    <>
      <Container maxWidth="7xl" className="px-4 py-4">
        <GlobalStatsCharts chainId={chainId} />
      </Container>
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
          <LinkInternal
            shallow={true}
            scroll={false}
            href={`/${ChainKey[chainId]}/explore/smart-pools`}
          >
            {isSteerChainId(chainId) ? (
              <PathnameButton
                id="smart-pools"
                pathname={`/${ChainKey[chainId]}/explore/smart-pools`}
                asChild
                size="sm"
              >
                Smart Pools
              </PathnameButton>
            ) : null}
          </LinkInternal>
        </div>
      </Container>
      <section className="flex flex-col flex-1">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-20 h-full">
          <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
        </div>
      </section>
    </>
  )
}
