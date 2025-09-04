import { Container } from '@sushiswap/ui'
import { BarBalanceCard } from './_ui/bar-balance-card'
import { BarBalanceProvider } from './_ui/bar-balance-provider'
import { BarChartCard } from './_ui/bar-chart-card'
import { ManageBarCard } from './_ui/manage-bar-card'
import { VotingPowerCard } from './_ui/voting-power-card'
import { VotingPowerProvider } from './_ui/voting-power-provider'

export default async function Page() {
  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <VotingPowerProvider>
        <VotingPowerCard />
      </VotingPowerProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div>
          <ManageBarCard />
        </div>
        <div className="flex flex-col gap-6">
          <BarBalanceProvider>
            <BarBalanceCard />
          </BarBalanceProvider>
          <BarChartCard />
        </div>
      </div>
    </Container>
  )
}
