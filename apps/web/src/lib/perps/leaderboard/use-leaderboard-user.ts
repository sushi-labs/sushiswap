import {
  type PerpsLeaderboardTimeframe,
  type PerpsPointsSeason,
  getPerpsLeaderboardUser,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'

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
    enabled: Boolean(address),
  })
}
