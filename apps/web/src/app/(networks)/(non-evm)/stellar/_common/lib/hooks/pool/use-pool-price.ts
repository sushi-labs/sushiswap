'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import {
  calculatePriceFromSqrtPrice,
  getCurrentSqrtPrice,
} from '../../soroban/pool-helpers'

export const usePoolPrice = (address: string | null) => {
  return useQuery({
    queryKey: ['stellar', 'pool', 'price', address],
    queryFn: async () => {
      if (!address) {
        return null
      }
      const sqrtPriceX96 = await getCurrentSqrtPrice(address)
      const price = calculatePriceFromSqrtPrice(sqrtPriceX96)
      return price
    },
    enabled: Boolean(address),
    staleTime: ms('10s'), // 10 seconds
  })
}
