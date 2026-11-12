import { Container } from '@sushiswap/ui'
import { BarBalanceProvider } from './_ui/bar-balance-provider'
import { BarChartCard } from './_ui/bar-chart-card'
import { ManageBarCard } from './_ui/manage-bar-card'
import { VotingPowerCard } from './_ui/voting-power-card'
import { VotingPowerProvider } from './_ui/voting-power-provider'

export default async function Page() {
  return (
    <Container
      maxWidth="7xl"
      className="grid grid-cols-1 lg:grid-cols-[minmax(0,62fr)_minmax(0,38fr)] gap-4 px-2 pb-8 sm:px-4 lg:pb-16"
    >
      <div className="flex min-w-0 flex-col gap-4 order-2 lg:order-1">
        <div>
          <BarBalanceProvider>
            <VotingPowerProvider>
              <VotingPowerCard />
            </VotingPowerProvider>
          </BarBalanceProvider>
        </div>

        <BarChartCard />
      </div>
      <div className="min-w-0 order-1 lg:order-2">
        <ManageBarCard />
      </div>
    </Container>
  )
}
