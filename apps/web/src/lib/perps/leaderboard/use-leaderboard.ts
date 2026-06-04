import {
  type PerpsLeaderboardTimeframe,
  getPerpsLeaderboard,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { LeaderboardSortType } from '~evm/perps/leaderboard/_ui/leaderboard-provider'

export const useLeaderboard = ({
  timeframe = 'SEASON',
  sortBy = 'points',
}: {
  timeframe: PerpsLeaderboardTimeframe
  sortBy: LeaderboardSortType
}) => {
  return useQuery({
    queryKey: ['useLeaderboard', timeframe, sortBy],
    queryFn: async () => {
      const data = await getPerpsLeaderboard({
        timeframe,
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
