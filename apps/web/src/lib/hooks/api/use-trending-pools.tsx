import {
  type TrendingPools,
  getTrendingPools,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'

export function useTrendingPools() {
  const query = useQuery({
    queryKey: ['data-api-trending-pools'],
    queryFn: async () => {
      const trendingPools = await getTrendingPools()
      return trendingPools
    },
    staleTime: ms('1h'),
  })

  return query as typeof query & { data?: TrendingPools }
}
