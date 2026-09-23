import { getBuybackReserve } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { BUYBACK_RESERVE_PARAMS } from './constants'

interface UseBuybackReserve {
  enabled?: boolean
}

export const useBuybackReserve = ({ enabled = true }: UseBuybackReserve) => {
  return useQuery({
    queryKey: ['useBuybackReserve'],
    queryFn: () => {
      return getBuybackReserve(BUYBACK_RESERVE_PARAMS)
    },
    enabled: Boolean(enabled),
  })
}
