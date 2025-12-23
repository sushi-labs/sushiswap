'use client'

import { useQuery } from '@tanstack/react-query'
import { getPoolDirectSDK } from '../../soroban/dex-factory-helpers'

export interface GetPoolParams {
  tokenA: string
  tokenB: string
  fee: number
}

export const useGetPool = (params: GetPoolParams | null) => {
  return useQuery({
    queryKey: ['factory', 'getPool', params],
    queryFn: async () => {
      if (!params) return null
      return await getPoolDirectSDK(params)
    },
    enabled: !!params,
  })
}
