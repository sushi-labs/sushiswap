import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type React from 'react'
import { Suspense } from 'react'
import { AMM_SUPPORTED_CHAIN_IDS, POOL_SUPPORTED_NETWORKS } from 'src/config'
import { getEvmChainById, isEvmChainId } from 'sushi/evm'
import { getStaticChainParams } from '~evm/[chainId]/get-static-chain-params'
import { Header } from '../../header'
import { GlobalStatsCharts } from '../_ui/global-stats-charts'
import { NavigationItems } from '../navigation-items'
import { TokensFiltersProvider } from './_ui/tokens-filters-provider'

export const metadata: Metadata = {
  title: 'Tokens',
  description: 'Explore SushiSwap tokens.',
}

export function generateStaticParams() {
  return getStaticChainParams(AMM_SUPPORTED_CHAIN_IDS)
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

  return (
    <>
      <Header
        chainId={chainId}
        networks={POOL_SUPPORTED_NETWORKS.filter(isEvmChainId)}
      />
      <Suspense fallback={null}>
        <main className="flex flex-col h-full flex-1">
          <Container maxWidth="7xl" className="px-4 pt-7 md:pt-10 mb-6">
            <div className="flex flex-col md:gap-2">
              <h1 className="text-2xl md:text-4xl font-medium">
                Explore Tokens
              </h1>
              <p className="md:text-lg text-muted-foreground">
                Browse token prices and market data on{' '}
                {getEvmChainById(chainId).name}.
              </p>
            </div>
          </Container>
          <Container maxWidth="7xl" className="px-4 py-4">
            <GlobalStatsCharts chainId={chainId} />
          </Container>
          <Container maxWidth="7xl" className="px-4 flex gap-2 pb-4">
            <NavigationItems chainId={chainId} />
          </Container>
          <section className="flex flex-col flex-1">
            <TokensFiltersProvider>{children}</TokensFiltersProvider>
          </section>
        </main>
      </Suspense>
    </>
  )
}
