import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type React from 'react'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { GlobalStatsCharts } from 'src/ui/explore/global-stats-charts'
import { Statistics } from 'src/ui/explore/statistics'
import { Trending } from 'src/ui/explore/trending/trending'
import { PoolsFiltersProvider } from 'src/ui/pool'
import type { ChainId } from 'sushi/chain'
import { Header } from '../../header'
import { NavigationItems } from '../navigation-items'

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

  return (
    <>
      <Header chainId={chainId} supportedNetworks={POOL_SUPPORTED_NETWORKS} />
      <main className="flex flex-col flex-1 h-full animate-slide">
        <Container maxWidth="screen-3xl" className="px-4 py-4">
          <h2 className="pb-4 text-lg font-semibold md:pb-8 md:text-4xl">
            Explore Pool
          </h2>
          <div className="flex flex-col gap-3 justify-between lg:flex-row">
            <Statistics />
            <Trending />
          </div>
        </Container>
        <Container maxWidth="7xl" className="flex gap-2 px-4 pb-4">
          <NavigationItems chainId={chainId} />
        </Container>
        <section className="flex flex-col flex-1">
          <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10 min-h-screen">
            <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
          </div>
        </section>
      </main>
    </>
  )
}
