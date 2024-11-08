'use client'

import { GetV3Pool, V3Pool, getV3Pool } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'

export const useV3Pool = (params: Partial<GetV3Pool>, shouldFetch = true) => {
  return useQuery<V3Pool | null>({
    queryKey: ['v3-pool', params],
    queryFn: async () => await getV3Pool(params as GetV3Pool),
    enabled: Boolean(shouldFetch && params.chainId && params.address),
  })
}
