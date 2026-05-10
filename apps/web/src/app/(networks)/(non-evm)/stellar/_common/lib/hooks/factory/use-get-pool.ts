'use client'

import { useQuery } from '@tanstack/react-query'
import type { StellarContractAddress } from 'sushi/stellar'
import { getPoolDirectSDK } from '../../soroban/dex-factory-helpers'

export interface GetPoolParams {
  tokenA: StellarContractAddress
  tokenB: StellarContractAddress
  fee: number
}

export const useGetPool = (params: GetPoolParams | null) => {
  return useQuery({
    queryKey: ['factory', 'getPool', params],
    queryFn: async () => {
      if (!params) {
        return null
      }
      return await getPoolDirectSDK(params)
    },
    enabled: Boolean(params),
  })
}
