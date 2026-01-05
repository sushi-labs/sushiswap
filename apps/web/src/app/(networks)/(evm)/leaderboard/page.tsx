import { Container } from '@sushiswap/ui'
import { LeaderboardTable } from './_ui/leaderboard-table'

export default function LeaderboardPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="mt-6 md:mt-12">
        <LeaderboardTable />
      </div>
    </Container>
  )
}
