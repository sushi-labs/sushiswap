import { Container } from '@sushiswap/ui'
import { PoolsFiltersProvider } from 'src/ui/pool'
import { GlobalStatsCharts } from '~kadena/_common/ui/Pools/Explore/GlobalStatsChart'
import { Header } from '../header'

export const metadata = {
  title: 'Pools 💦',
}

export default function PoolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-col flex-1 min-h-screen animate-slide">
        <Container maxWidth="7xl" className="px-4 py-4">
          <GlobalStatsCharts />
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
