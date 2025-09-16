import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import {
  type ExplorePoolStatistics,
  getExplorePoolStatistics,
} from '@sushiswap/graph-client/data-api-181'
import { Container } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import type React from 'react'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { ExploreHeader } from 'src/ui/explore/header'
import { Statistics } from 'src/ui/explore/statistics'
import { Trending } from 'src/ui/explore/trending/trending'
import { PoolsFiltersProvider } from 'src/ui/pool'
import type { ChainId } from 'sushi/chain'
import { Header } from '../../header'

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

  const chainId = +params.chainId as ChainId

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
      revalidate: 60 * 15,
    },
  )()

  return (
    <>
      <Header chainId={chainId} supportedNetworks={POOL_SUPPORTED_NETWORKS} />
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
