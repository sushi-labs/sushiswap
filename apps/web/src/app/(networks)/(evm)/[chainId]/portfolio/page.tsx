import { Container } from '@sushiswap/ui'
import { PnLChart } from 'src/ui/portfolio/pnl-chart'
import { PortfolioHeader } from 'src/ui/portfolio/portfolio-header'
import { TablesView } from 'src/ui/portfolio/tables-view/tables-view'
//@dev keep this a SSR page
export default function PortfolioPage() {
  return (
    <main className="lg:p-4 md:p-2 pt-9 md:mb-[86px] animate-slide bg-white dark:bg-background md:bg-background">
      <Container maxWidth="screen-2xl" className="flex flex-col gap-6 px-4">
        <PortfolioHeader />
        <PnLChart />
        <TablesView />
      </Container>
    </main>
  )
}
