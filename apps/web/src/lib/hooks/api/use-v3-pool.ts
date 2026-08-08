'use client'

import {
  type GetV3Pool,
  type V3Pool,
  getV3Pool,
  hydrateV3Pool,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'

export const useV3Pool = (params: Partial<GetV3Pool>, shouldFetch = true) => {
  return useQuery<V3Pool | null>({
    queryKey: ['v3-pool', params],
    queryFn: async () => {
      const rawPool = await getV3Pool(params as GetV3Pool)
      return rawPool ? hydrateV3Pool(rawPool) : null
    },
    enabled: Boolean(shouldFetch && params.chainId && params.address),
  })
}
