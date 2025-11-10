'use client'

import { useQuery } from '@tanstack/react-query'
import {
  calculateAmountsFromLiquidity,
  calculateLiquidityFromAmount0,
  getCurrentSqrtPrice,
  tickToSqrtPrice,
} from '../../soroban/pool-helpers'
import { formatTokenAmountWithDecimals } from '../../utils/format'

/**
 * Calculate the required token1 amount based on token0 input
 * Matches the implementation from stellar-auth-test
 */
export function useCalculatePairedAmount(
  poolAddress: string | null,
  token0Amount: string,
  tickLower: number,
  tickUpper: number,
  decimals = 7,
  token0Code?: string,
) {
  return useQuery({
    queryKey: [
      'pool',
      'pairedAmount',
      poolAddress,
      token0Amount,
      tickLower,
      tickUpper,
    ],
    queryFn: async (): Promise<{
      token1Amount: string
      status: 'idle' | 'below-range' | 'above-range' | 'within-range' | 'error'
      error?: string
    }> => {
      if (!poolAddress || !token0Amount || Number(token0Amount) <= 0) {
        return {
          token1Amount: '',
          status: 'idle',
        }
      }

      try {
        // Get current sqrt price from pool
        const currentSqrtPriceX96 = await getCurrentSqrtPrice(poolAddress)

        // Calculate sqrt prices at boundaries
        const sqrtPriceLowerX96 = tickToSqrtPrice(tickLower)
        const sqrtPriceUpperX96 = tickToSqrtPrice(tickUpper)

        // Check if price is below range
        if (currentSqrtPriceX96 < sqrtPriceLowerX96) {
          return {
            token1Amount: '0',
            status: 'below-range',
            error: `Price below range - only ${token0Code} needed`,
          }
        }

        // Check if price is above range
        if (currentSqrtPriceX96 >= sqrtPriceUpperX96) {
          return {
            token1Amount: '0',
            status: 'above-range',
            error: `Price above range - cannot provide ${token0Code} liquidity`,
          }
        }

        // Price is within range - calculate paired amount
        const inputAmount = Number.parseFloat(token0Amount)
        const scaledAmount0 = BigInt(Math.floor(inputAmount * 10 ** decimals))

        // Calculate liquidity from token0 amount
        const liquidity = calculateLiquidityFromAmount0(
          scaledAmount0,
          currentSqrtPriceX96,
          sqrtPriceLowerX96,
          sqrtPriceUpperX96,
        )

        // Calculate both token amounts from this liquidity
        const amounts = calculateAmountsFromLiquidity(
          liquidity,
          currentSqrtPriceX96,
          sqrtPriceLowerX96,
          sqrtPriceUpperX96,
        )

        // Convert token1 amount back to token units
        const pairedAmount = formatTokenAmountWithDecimals(
          amounts.amount1,
          decimals,
        )

        // Check for invalid results
        if (amounts.amount1 < 0n) {
          return {
            token1Amount: '0',
            status: 'error',
            error: 'Invalid paired amount calculated',
          }
        }

        return {
          token1Amount: pairedAmount,
          status: 'within-range',
        }
      } catch (error) {
        console.error('Error calculating paired amount:', error)
        return {
          token1Amount: '0',
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },
    enabled: !!poolAddress && !!token0Amount && Number(token0Amount) > 0,
    staleTime: 10000, // 10 seconds
  })
}
