import { getPerpsPointsHistory } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { sushiPointsQueryKeys } from '../sushi-points'

export function useSushiPointsHistory({
  address,
  from,
  to,
}: {
  address: EvmAddress | undefined
  from?: string
  to?: string
}) {
  return useQuery({
    queryKey: sushiPointsQueryKeys.history(address, from, to),
    queryFn: async () => {
      if (!address) {
        throw new Error('address is required')
      }

      return getPerpsPointsHistory({ address, from, to })
    },
    enabled: Boolean(address),
  })
}
