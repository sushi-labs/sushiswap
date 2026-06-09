import { getPerpsPointsOverview } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { sushiPointsQueryKeys } from '../sushi-points'

export function useSushiPointsOverview({
  address,
}: {
  address: EvmAddress | undefined
}) {
  return useQuery({
    queryKey: sushiPointsQueryKeys.overview(address),
    queryFn: async () => {
      if (!address) {
        throw new Error('address is required')
      }

      return getPerpsPointsOverview({ address })
    },
    enabled: Boolean(address),
  })
}
