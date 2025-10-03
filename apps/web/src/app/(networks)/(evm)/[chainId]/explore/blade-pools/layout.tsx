import { Container } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type React from 'react'
import { getPublicBladeChainIds, isPublicBladeChainId } from 'src/config.server'
import { isBladeChainId } from 'sushi/evm'
import { Header } from '~evm/[chainId]/header'
import { GlobalStatsCharts } from '../_ui/global-stats-charts'
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

  const chainId = +params.chainId

  if (!isBladeChainId(chainId) || !(await isPublicBladeChainId(chainId))) {
    return notFound()
  }

  const bladeChainIds = await getPublicBladeChainIds()

  return (
    <>
      <Header chainId={chainId} networks={bladeChainIds} />
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
