'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
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
      'stellar',
      'swap',
      'poolsBetween',
      params.tokenA.contract,
      params.tokenB.contract,
    ],
    queryFn: async () => {
      const pools = await service.getPoolsBetween(params.tokenA, params.tokenB)
      return pools
    },
    enabled: Boolean(params.enabled !== false),
    staleTime: ms('1m'),
  })
}
