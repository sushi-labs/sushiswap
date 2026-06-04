import {
  type PerpsLeaderboardTimeframe,
  getPerpsLeaderboardUser,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'

export const useLeaderboardUser = ({
  timeframe = 'SEASON',
  address,
}: {
  timeframe: PerpsLeaderboardTimeframe
  address: EvmAddress | undefined
}) => {
  return useQuery({
    queryKey: ['useLeaderboardUser', timeframe, address],
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
