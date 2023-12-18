import { Container, Separator } from '@sushiswap/ui'
import { BarBalanceCard } from './BarBalanceCard'
import { BarChartCard } from './BarChartCard'
import { BarDistributionsCard } from './BarDistributionsCard'
import { ManageBarCard } from './ManageBarCard'
import { VotingPowerCard } from './VotingPowerCard'

interface BarPage {
  tab: 'stake' | 'unstake'
}

export const BarPage = ({ tab }: BarPage) => {
  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <VotingPowerCard />
      <div className="grid grid-cols-1 md:grid-cols-[auto_400px] gap-6 pt-6">
        <div>
          <ManageBarCard tab={tab} />
        </div>
        <div className="flex flex-col gap-6">
          <BarBalanceCard />
          <BarChartCard />
        </div>
      </div>
      <div className="py-4">
        <Separator />
      </div>
      <BarDistributionsCard />
    </Container>
  )
}
