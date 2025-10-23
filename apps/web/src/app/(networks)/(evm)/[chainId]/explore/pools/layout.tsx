import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import {
  type ExplorePoolStatistics,
  getExplorePoolStatistics,
} from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import ms from 'ms'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import type React from 'react'
import { PoolsFiltersProvider } from 'src/app/(networks)/_ui/pools-filters-provider'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { Header } from '../../header'
import { ExploreHeader } from '../_ui/header'
import { Statistics } from '../_ui/statistics'
import { Trending } from '../_ui/trending/trending'

export const metadata: Metadata = {
  title: 'Pools',
  description: 'Explore SushiSwap pools.',
}

export default async function ExploreLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId

  if (!isPoolChainId(chainId)) {
    return notFound()
  }

  const explorePoolStatistics = await unstable_cache(
    async (): Promise<ExplorePoolStatistics> =>
      isPoolChainId(chainId)
        ? getExplorePoolStatistics()
        : {
            v2: {
              liquidityUSD: 0,
              liquidityUSDChange1w: 0,
              volumeUSD1w: 0,
              volumeUSDChange1w: 0,
            },
            v3: {
              liquidityUSD: 0,
              liquidityUSDChange1w: 0,
              volumeUSD1w: 0,
              volumeUSDChange1w: 0,
            },
            all: {
              liquidityUSD: 0,
              liquidityUSDChange1w: 0,
              volumeUSD1w: 0,
              volumeUSDChange1w: 0,
            },
          },
    ['explorePoolStatistics', `${chainId}`],
    {
      revalidate: ms('15m'),
    },
  )()

  return (
    <>
      <Header chainId={chainId} networks={POOL_SUPPORTED_NETWORKS} />
      <main className="flex flex-col flex-1 md:gap-6 h-full animate-slide">
        <Container className="px-4 pt-4 md:pb-4 pb-0 max-w-[1696px]">
          <ExploreHeader chainId={chainId} />
          <div className="flex flex-col gap-3 justify-between lg:flex-row">
            <Statistics stats={explorePoolStatistics} />
            <Trending />
          </div>
        </Container>
        <section className="flex flex-col flex-1">
          <div>
            <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
          </div>
        </section>
      </main>
    </>
  )
}
