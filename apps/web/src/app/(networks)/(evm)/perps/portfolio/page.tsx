import { Container } from '@sushiswap/ui'
import { AccountCharts } from './_ui/account-charts'
import { DialogRow } from './_ui/dialog-row'
import { Fees } from './_ui/fees'
import { PortfolioStats } from './_ui/portfolio-stats'
import { Volume } from './_ui/volume'

export default async function PerpetualsPortfolioPage() {
  return (
    <Container maxWidth="7xl" className="pb-4 pt-6 md:pt-12 px-2 md:px-4">
      <div className="flex flex-col gap-2">
        <div className="flex lg:items-center lg:justify-between gap-2 flex-col lg:flex-row pb-4">
          <h1 className="font-medium text-4xl">Portfolio</h1>
          <DialogRow />
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="flex flex-row w-full lg:flex-col gap-2">
            <Volume />
            <Fees />
          </div>
          <PortfolioStats />
          <AccountCharts />
        </div>
        <div className="min-h-[450px] border">tables</div>
      </div>
    </Container>
  )
}
