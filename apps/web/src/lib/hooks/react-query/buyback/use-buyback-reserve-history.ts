import { getBuybackReserveHistory } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { BUYBACK_RESERVE_PARAMS } from './constants'

interface UseBuybackReserveHistory {
  enabled?: boolean
}

export const useBuybackReserveHistory = ({
  enabled = true,
}: UseBuybackReserveHistory) => {
  return useQuery({
    queryKey: ['useBuybackReserveHistory'],
    queryFn: () => {
      return getBuybackReserveHistory(BUYBACK_RESERVE_PARAMS)
    },
    enabled: Boolean(enabled),
  })
}
