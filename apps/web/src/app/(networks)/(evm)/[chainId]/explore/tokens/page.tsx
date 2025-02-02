import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import React from 'react'
import { GlobalStatsCharts } from 'src/ui/explore/global-stats-charts'
import { TokenFiltersProvider } from 'src/ui/tokens/TokenFiltersProvider'
import { TokensTable } from 'src/ui/tokens/TokensTable'
import { ChainId } from 'sushi/chain'
import { NavigationItems } from '../navigation-items'

export default async function TokensPage(props: {
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const chainId = +params.chainId as ChainId

  if (!isPoolChainId(chainId)) {
    return notFound()
  }

  return (
    <main className="flex flex-col h-full flex-1">
      <Container maxWidth="7xl" className="px-4 py-4">
        <GlobalStatsCharts chainId={chainId} />
      </Container>
      <Container maxWidth="7xl" className="px-4 flex gap-2 pb-4">
        <NavigationItems chainId={chainId} />
      </Container>
      <section className="flex flex-col flex-1">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10 min-h-screen">
          <TokenFiltersProvider>
            <Container maxWidth="7xl" className="px-4">
              <TokensTable chainId={chainId} />
            </Container>
          </TokenFiltersProvider>
        </div>
      </section>
    </main>
  )
}
