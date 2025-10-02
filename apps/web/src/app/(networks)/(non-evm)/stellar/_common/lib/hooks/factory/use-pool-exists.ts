'use client'

import { useQuery } from '@tanstack/react-query'
import { poolExists } from '../../soroban/dex-factory-helpers'

export interface PoolExistsParams {
  tokenA: string
  tokenB: string
  fee: number
}

export const usePoolExists = (params: PoolExistsParams | null) => {
  return useQuery({
    queryKey: ['factory', 'poolExists', params],
    queryFn: async () => {
      if (!params) return false
      return await poolExists(params)
    },
    enabled: !!params,
  })
}
