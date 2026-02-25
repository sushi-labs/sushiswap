import { Container } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { ChainId } from 'sushi'
import { ExploreHero } from '../../_ui/explore-hero'
import { Header } from '../header'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Pools 💦',
}

export default function PoolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Header networks={POOL_SUPPORTED_NETWORKS} />
      <main className="flex flex-col h-full flex-1 animate-slide">
        <Container maxWidth="7xl" className="px-4 py-10 md:py-16">
          <ExploreHero chainId={ChainId.APTOS} />
        </Container>
        <section className="flex flex-col min-h-screen">
          <div className="flex-1 bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10">
            <Providers>{children}</Providers>
          </div>
        </section>
      </main>
    </>
  )
}
