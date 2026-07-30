import {
  type PerpsLeaderboardTimeframe,
  type PerpsPointsSeason,
  getPerpsLeaderboard,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { LeaderboardSortType } from '~evm/perps/leaderboard/_ui/leaderboard-provider'

export const useLeaderboard = ({
  timeframe = 'SEASON',
  sortBy = 'points',
  season = 'CURRENT',
}: {
  timeframe: PerpsLeaderboardTimeframe
  sortBy: LeaderboardSortType
  season?: PerpsPointsSeason
}) => {
  return useQuery({
    queryKey: ['useLeaderboard', timeframe, sortBy, season],
    queryFn: async () => {
      const data = await getPerpsLeaderboard({
        timeframe,
        season,
      })
      const sortedData = data.entries.sort((a, b) => {
        if (sortBy === 'PNL') {
          return b.pnl - a.pnl
        } else {
          return b.points - a.points
        }
      })
      return {
        ...data,
        entries: sortedData,
      }
    },
  })
}
