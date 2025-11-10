'use client'

import { useQuery } from '@tanstack/react-query'
import {
  calculatePriceFromSqrtPrice,
  getCurrentSqrtPrice,
} from '../../soroban/pool-helpers'

export const usePoolPrice = (address: string | null) => {
  return useQuery({
    queryKey: ['pool', 'price', address],
    queryFn: async () => {
      if (!address) return null
      const sqrtPriceX96 = await getCurrentSqrtPrice(address)
      const price = calculatePriceFromSqrtPrice(sqrtPriceX96)
      return price
    },
    enabled: !!address,
  })
}
