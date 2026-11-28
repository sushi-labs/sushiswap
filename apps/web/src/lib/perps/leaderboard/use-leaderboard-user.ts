import {
  type PerpsLeaderboardTimeframe,
  type PerpsLeaderboardUser,
  type PerpsPointsSeason,
  getPerpsLeaderboardUser,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'

function selectRankedUser(user: PerpsLeaderboardUser) {
  if (user?.rank == null) return null

  return { ...user, rank: user.rank }
}

export const useLeaderboardUser = ({
  timeframe = 'SEASON',
  address,
  season = 'CURRENT',
}: {
  timeframe: PerpsLeaderboardTimeframe
  address: EvmAddress | undefined
  season?: PerpsPointsSeason
}) => {
  return useQuery({
    queryKey: ['useLeaderboardUser', timeframe, address, season],
    queryFn: async () => {
      if (!address) {
        throw new Error('address is undefined')
      }
      return getPerpsLeaderboardUser({
        timeframe,
        address,
        season,
      })
    },
    select: selectRankedUser,
    enabled: Boolean(address),
  })
}
