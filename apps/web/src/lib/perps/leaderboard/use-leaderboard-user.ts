import {
  type PerpsLeaderboardTimeframe,
  getPerpsLeaderboardUser,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import type { LeaderboardSortType } from '~evm/perps/leaderboard/_ui/leaderboard-provider'

export const useLeaderboardUser = ({
  timeframe = 'SEASON',
  sortBy = 'points',
  address,
}: {
  timeframe: PerpsLeaderboardTimeframe
  sortBy: LeaderboardSortType
  address: EvmAddress | undefined
}) => {
  return useQuery({
    queryKey: ['useLeaderboardUser', timeframe, address, sortBy],
    queryFn: async () => {
      if (!address) {
        throw new Error('address is undefined')
      }
      return getPerpsLeaderboardUser({
        timeframe,
        address,
      })
    },
    enabled: Boolean(address),
  })
}
