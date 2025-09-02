import { Container } from '@sushiswap/ui'
import { BarBalanceCard } from './_ui/BarBalanceCard'
import { BarBalanceProvider } from './_ui/BarBalanceProvider'
import { BarChartCard } from './_ui/BarChartCard'
import { ManageBarCard } from './_ui/ManageBarCard'
import { VotingPowerCard } from './_ui/VotingPowerCard'
import { VotingPowerProvider } from './_ui/VotingPowerProvider'

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
