'use client'

import {
  type GetV3Pool,
  type V3Pool,
  getV3Pool,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'

export const useV3Pools = (
  params: Partial<GetV3Pool[]>,
  shouldFetch = true,
) => {
  return useQuery<V3Pool[] | null>({
    queryKey: ['v3-pools', params],
    queryFn: async () => {
      const promises = params.map((param) => getV3Pool(param as GetV3Pool))
      const results = await Promise.allSettled(promises)
      return results
        .filter(
          (result): result is PromiseFulfilledResult<V3Pool> =>
            result.status === 'fulfilled',
        )
        .map((result) => result.value)
    },
    enabled: Boolean(shouldFetch && params?.length > 0),
  })
}
