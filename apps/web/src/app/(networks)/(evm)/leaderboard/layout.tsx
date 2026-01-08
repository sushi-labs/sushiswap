import { getCurrentSeason } from '@sushiswap/graph-client/leaderboard'
import { Container } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { EvmChainId, evmChainIds } from 'sushi/evm'
import { Header } from '~evm/[chainId]/header'
import { Hero } from './hero'

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'See top traders by points and volume on SushiSwap.',
}

export default async function LeaderboardLayout({
  children,
}: { children: React.ReactNode }) {
  const currentSeason = await getCurrentSeason()
  return (
    <>
      <Header chainId={EvmChainId.ETHEREUM} networks={evmChainIds} />
      <main className="flex flex-col h-full flex-1 animate-slide">
        <Container maxWidth="7xl" className="px-4 py-8 md:py-16">
          <Hero currentSeason={currentSeason} />
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
