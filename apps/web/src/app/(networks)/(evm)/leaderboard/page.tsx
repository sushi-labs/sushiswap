import { Container } from '@sushiswap/ui'
import { LeaderboardTable } from './_ui/leaderboard-table'
import { UserTier } from './_ui/user-tier/user-tier'

export default function LeaderboardPage() {
  return (
    <Container maxWidth="7xl" className="px-4">
      <div className="mt-12">
        <UserTier />
      </div>
      <div className="mt-8">
        <LeaderboardTable />
      </div>
    </Container>
  )
}
