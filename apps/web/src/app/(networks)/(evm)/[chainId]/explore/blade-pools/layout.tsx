import { Container } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type React from 'react'
import { GlobalStatsCharts } from 'src/ui/explore/global-stats-charts'
import type { EvmChainId } from 'sushi/chain'
import { BLADE_SUPPORTED_CHAIN_IDS, isBladeChainId } from 'sushi/config'
import { Header } from '~evm/[chainId]/header'
import { NavigationItems } from '../navigation-items'

export const metadata: Metadata = {
  title: 'Blade Pools',
  description:
    'Blade is a new AMM with up to 100x concentrated liquidity, automated rebalancing, and no Impermanent Loss. It combines offchain compute with onchain verification so prices update in real-time and your liquidity never gets arbitraged.',
}

export default async function ExploreLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId as EvmChainId

  if (!isBladeChainId(chainId)) {
    return notFound()
  }

  return (
    <>
      <Header chainId={chainId} supportedNetworks={BLADE_SUPPORTED_CHAIN_IDS} />
      <main className="flex flex-col h-full flex-1">
        <Container maxWidth="7xl" className="px-4 py-4">
          <GlobalStatsCharts chainId={chainId} />
        </Container>
        <Container maxWidth="7xl" className="px-4 flex gap-2 pb-4">
          <NavigationItems chainId={chainId} />
        </Container>
        <section className="flex flex-col flex-1">
          <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10 min-h-screen">
            {children}
          </div>
        </section>
      </main>
    </>
  )
}
