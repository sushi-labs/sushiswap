import { Container } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type React from 'react'
import { SUSHISWAP_SUPPORTED_CHAIN_IDS, isSushiSwapChainId } from 'sushi/evm'
import { Header } from '../../header'
import { GlobalStatsCharts } from '../_ui/global-stats-charts'
import { NavigationItems } from '../navigation-items'
import { TokensFiltersProvider } from './_ui/TokensFiltersProvider'

export const metadata: Metadata = {
  title: 'Tokens',
  description: 'Explore SushiSwap tokens.',
}

export default async function ExploreLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId

  if (!isSushiSwapChainId(chainId)) {
    return notFound()
  }

  return (
    <>
      <Header
        chainId={chainId}
        supportedNetworks={SUSHISWAP_SUPPORTED_CHAIN_IDS}
      />
      <main className="flex flex-col h-full flex-1 animate-slide">
        <Container maxWidth="7xl" className="px-4 py-4">
          <GlobalStatsCharts chainId={chainId} />
        </Container>
        <Container maxWidth="7xl" className="px-4 flex gap-2 pb-4">
          <NavigationItems chainId={chainId} />
        </Container>
        <section className="flex flex-col flex-1">
          <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10 min-h-screen">
            <TokensFiltersProvider>{children}</TokensFiltersProvider>
          </div>
        </section>
      </main>
    </>
  )
}
