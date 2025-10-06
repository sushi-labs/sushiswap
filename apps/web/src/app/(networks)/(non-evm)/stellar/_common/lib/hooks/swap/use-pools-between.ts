'use client'

import { useQuery } from '@tanstack/react-query'
import { createSushiStellarService } from '../../services/sushi-stellar-service'
import type { Token } from '../../types/token.type'

export interface UsePoolsBetweenParams {
  tokenA: Token
  tokenB: Token
  enabled?: boolean
}

export const usePoolsBetween = (params: UsePoolsBetweenParams) => {
  const service = createSushiStellarService()

  return useQuery({
    queryKey: [
      'swap',
      'poolsBetween',
      params.tokenA.contract,
      params.tokenB.contract,
    ],
    queryFn: async () => {
      const pools = await service.getPoolsBetween(params.tokenA, params.tokenB)
      console.log(
        `Found ${pools.length} pools between ${params.tokenA.code} and ${params.tokenB.code}`,
      )
      return pools
    },
    enabled: params.enabled !== false,
    staleTime: 60000, // 1 minute
  })
}
