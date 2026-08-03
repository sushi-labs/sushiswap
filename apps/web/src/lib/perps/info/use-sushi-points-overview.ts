import { getPerpsPointsOverview } from '@sushiswap/graph-client/data-api'
import type { PerpsPointsSeason } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { sushiPointsQueryKeys } from '../sushi-points'

export function useSushiPointsOverview({
  address,
  season = 'CURRENT',
}: {
  address: EvmAddress | undefined
  season?: PerpsPointsSeason
}) {
  return useQuery({
    queryKey: sushiPointsQueryKeys.overview(address, season),
    queryFn: async () => {
      if (!address) {
        throw new Error('address is required')
      }

      return getPerpsPointsOverview({ address, season })
    },
    enabled: Boolean(address),
  })
}
