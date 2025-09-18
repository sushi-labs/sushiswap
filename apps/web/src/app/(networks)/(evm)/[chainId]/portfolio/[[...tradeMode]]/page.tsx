import { Container } from '@sushiswap/ui'
import { AssetsChart } from 'src/ui/portfolio/assets-chart/assets-chart'
import { PortfolioHeader } from 'src/ui/portfolio/portfolio-header'
import { TablesView } from 'src/ui/portfolio/tables-view/tables-view'
import { WalletHoldings } from 'src/ui/portfolio/wallet-holdings/wallet-holdings'

export default function PortfolioPage() {
  return (
    <main className="lg:p-4 md:p-2 pt-9 md:mb-[86px] animate-slide dark:bg-background bg-background">
      <Container
        maxWidth="screen-2xl"
        className="flex flex-col gap-6 px-4 md:pt-6"
      >
        <PortfolioHeader />
        <AssetsChart />
        <WalletHoldings />
        <TablesView />
      </Container>
    </main>
  )
}
