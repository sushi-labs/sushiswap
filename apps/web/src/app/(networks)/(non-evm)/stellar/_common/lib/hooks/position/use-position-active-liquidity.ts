'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import {
  calculateActiveLiquidity,
  getCurrentSqrtPrice,
  tickToSqrtPrice,
} from '../../soroban/pool-helpers'

/**
 * Calculate the active liquidity of a position.
 * The ratio of this with the active pool liquidity gives the proportion of fees earned by the position.
 */
export function usePositionActiveLiquidity({
  poolAddress,
  scaledAmount0,
  scaledAmount1,
  tickLower,
  tickUpper,
}: {
  poolAddress: string | null
  scaledAmount0: bigint
  scaledAmount1: bigint
  tickLower: number
  tickUpper: number
}) {
  return useQuery({
    queryKey: [
      'stellar',
      'pool',
      'positionActiveLiquidity',
      {
        poolAddress,
        scaledAmount0: scaledAmount0.toString(),
        scaledAmount1: scaledAmount1.toString(),
        tickLower,
        tickUpper,
      },
    ],
    queryFn: async (): Promise<bigint> => {
      if (poolAddress === null) {
        return 0n
      }

      try {
        // Get current sqrt price from pool
        const currentSqrtPriceX96 = await getCurrentSqrtPrice(poolAddress)

        // Calculate sqrt prices at boundaries
        const sqrtPriceLowerX96 = tickToSqrtPrice(tickLower)
        const sqrtPriceUpperX96 = tickToSqrtPrice(tickUpper)

        const positionActiveLiquidity = calculateActiveLiquidity({
          currentSqrtPriceX96,
          sqrtPriceLowerX96,
          sqrtPriceUpperX96,
          scaledAmount0,
          scaledAmount1,
        })

        return positionActiveLiquidity
      } catch (error) {
        console.error('Error getting position active liquidity:', error)
        return 0n
      }
    },
    enabled: Boolean(poolAddress),
    staleTime: ms('10s'),
  })
}
