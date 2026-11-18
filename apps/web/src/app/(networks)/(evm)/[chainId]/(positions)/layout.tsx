import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PoolsFiltersProvider } from 'src/app/(networks)/_ui/pools-filters-provider'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { isEvmChainId } from 'sushi/evm'
import { getStaticChainParams } from '~evm/[chainId]/get-static-chain-params'
import { LiquidityHero } from '../_ui/liquidity-hero'
import { Header } from '../header'
import { NavigationItems } from './navigation-items'
import { PositionFiltersProvider } from './pool/_ui/position-filters-provider'
import { PositionStats } from './pool/_ui/position-stats'

export function generateStaticParams() {
  return getStaticChainParams(POOL_SUPPORTED_NETWORKS.filter(isEvmChainId))
}

export default async function PositionsLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId

  if (!isPoolChainId(chainId)) {
    return notFound()
  }

  return (
    <>
      <Header chainId={chainId} networks={POOL_SUPPORTED_NETWORKS} />
      <Suspense fallback={null}>
        <PositionFiltersProvider chainId={chainId}>
          <main className="flex flex-col h-full flex-1">
            <Container maxWidth="7xl" className="px-4 pt-7 md:pt-10 mb-6">
              <LiquidityHero chainId={chainId} />
            </Container>
            <Container maxWidth="7xl" className="px-4 flex gap-2 pb-4">
              <PositionStats chainId={chainId} />
            </Container>
            <section className="flex flex-col flex-1">
              <PoolsFiltersProvider>{children}</PoolsFiltersProvider>
            </section>
          </main>
        </PositionFiltersProvider>
      </Suspense>
    </>
  )
}
