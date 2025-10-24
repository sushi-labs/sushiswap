import { Container } from '@sushiswap/ui'
import { AssetsChart } from '~evm/[chainId]/portfolio/_ui/assets-chart/assets-chart'
import { PortfolioHeader } from '~evm/[chainId]/portfolio/_ui/portfolio-header'
import { TablesView } from '~evm/[chainId]/portfolio/_ui/tables-view/tables-view'
import { WalletHoldings } from '~evm/[chainId]/portfolio/_ui/wallet-holdings/wallet-holdings'

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
