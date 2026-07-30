import {
  type PerpsPointsSeason,
  getPerpsPointsHistory,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { sushiPointsQueryKeys } from '../sushi-points'

export function useSushiPointsHistory({
  address,
  from,
  to,
  season = 'CURRENT',
}: {
  address: EvmAddress | undefined
  from?: string
  to?: string
  season?: PerpsPointsSeason
}) {
  return useQuery({
    queryKey: sushiPointsQueryKeys.history(address, from, to, season),
    queryFn: async () => {
      if (!address) {
        throw new Error('address is required')
      }

      return getPerpsPointsHistory({ address, from, to, season })
    },
    enabled: Boolean(address),
  })
}
