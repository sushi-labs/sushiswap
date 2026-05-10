'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { StellarContractAddress } from 'sushi/stellar'
import {
  calculatePriceFromSqrtPrice,
  getCurrentSqrtPrice,
} from '../../soroban/pool-helpers'

export const usePoolPrice = (poolAddress: StellarContractAddress | null) => {
  return useQuery({
    queryKey: ['stellar', 'pool', 'price', poolAddress],
    queryFn: async () => {
      if (!poolAddress) {
        throw new Error('Pool address is required')
      }
      const sqrtPriceX96 = await getCurrentSqrtPrice(poolAddress)
      const price = calculatePriceFromSqrtPrice(sqrtPriceX96)
      return price
    },
    enabled: Boolean(poolAddress),
    staleTime: ms('10s'), // 10 seconds
  })
}
