'use client'

import { LeaderboardLeaders } from './leaderboard-leaders'
import { LeaderboardSortBy } from './leaderboard-sort-by'
import { LeaderboardTable } from './leaderboard-table'
import { LeaderboardTimeframe } from './leaderboard-timeframe'
import { SeasonCountdown } from './season-countdown'

export function LeaderboardPage() {
  return (
    <div className="flex flex-col gap-2 mb-14">
      <div className="flex items-start gap-2 justify-between">
        <div>
          <h1 className="text-4xl font-medium mb-2">Leaderboard</h1>
          <p className="text-perps-muted-50">
            Compete for Season 1 rewards. Top traders earn{' '}
            <span className="text-white font-medium">exclusive perks.</span>
          </p>
        </div>
        <SeasonCountdown />
      </div>
      <div className="flex items-center gap-2 justify-between mt-2">
        <LeaderboardSortBy />
        <LeaderboardTimeframe />
      </div>
      <LeaderboardLeaders />
      <LeaderboardTable />
    </div>
  )
}
