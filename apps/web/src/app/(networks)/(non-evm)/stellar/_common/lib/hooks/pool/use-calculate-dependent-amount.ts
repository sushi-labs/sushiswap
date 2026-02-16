'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { formatUnits } from 'viem'
import {
  calculateAmountsFromLiquidity,
  calculateLiquidityFromAmount0,
  calculateLiquidityFromAmount1,
  getCurrentSqrtPrice,
  tickToSqrtPrice,
} from '../../soroban/pool-helpers'
import { usePoolInitialized } from './use-pool-initialized'

export type Field = 'token0' | 'token1'

/**
 * Calculate the dependent token amount based on independent token input
 */
export function useCalculateDependentAmount(
  poolAddress: string | null,
  amount: string,
  independentField: Field,
  tickLower: number,
  tickUpper: number,
  independentDecimals: number,
  dependentDecimals: number,
  independentTokenCode?: string,
  dependentTokenCode?: string,
) {
  const { data: initialized } = usePoolInitialized(poolAddress)

  return useQuery({
    queryKey: [
      'stellar',
      'pool',
      'dependentAmount',
      poolAddress,
      amount,
      independentField,
      tickLower,
      tickUpper,
    ],
    queryFn: async (): Promise<{
      amount: string
      status: 'idle' | 'below-range' | 'above-range' | 'within-range' | 'error'
      error?: string
    }> => {
      if (!poolAddress || !initialized) {
        return {
          amount: '',
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
          // Below range: only token0 needed
          if (independentField === 'token0') {
            // User input token0, they need 0 token1
            return {
              amount: '0',
              status: 'below-range',
              error: `Price below range - only ${independentTokenCode} needed`,
            }
          } else {
            // User input token1, but we need token0.
            // If price is below range, liquidity comes purely from token0.
            // So we cannot provide liquidity with token1 only (unless we zap).
            // But strictly speaking, the dependent amount (token0) required for this token1 amount is Infinite or Undefined?
            // Actually, if we have token1, and we are below range, we are "out of range" for token1.
            // So required token0 is undefined/error.
            return {
              amount: '0',
              status: 'below-range',
              error: `Price below range - cannot provide liquidity with ${independentTokenCode} (need ${dependentTokenCode})`,
            }
          }
        }

        // Check if price is above range
        if (currentSqrtPriceX96 >= sqrtPriceUpperX96) {
          // Above range: only token1 needed
          if (independentField === 'token1') {
            // User input token1, they need 0 token0
            return {
              amount: '0',
              status: 'above-range',
              error: `Price above range - only ${independentTokenCode} needed`,
            }
          } else {
            // User input token0, but we need token1.
            return {
              amount: '0',
              status: 'above-range',
              error: `Price above range - cannot provide liquidity with ${independentTokenCode} (need ${dependentTokenCode})`,
            }
          }
        }

        // Price is within range - calculate dependent amount
        const inputAmount = Number.parseFloat(amount || '0')
        const scaledAmount = BigInt(
          Math.floor(inputAmount * 10 ** independentDecimals),
        )

        let liquidity = 0n
        if (independentField === 'token0') {
          liquidity = calculateLiquidityFromAmount0(
            scaledAmount,
            currentSqrtPriceX96,
            sqrtPriceLowerX96,
            sqrtPriceUpperX96,
          )
        } else {
          liquidity = calculateLiquidityFromAmount1(
            scaledAmount,
            currentSqrtPriceX96,
            sqrtPriceLowerX96,
            sqrtPriceUpperX96,
          )
        }

        // Calculate both token amounts from this liquidity
        const amounts = calculateAmountsFromLiquidity(
          liquidity,
          currentSqrtPriceX96,
          sqrtPriceLowerX96,
          sqrtPriceUpperX96,
        )

        // Get the dependent amount
        const dependentAmountBigInt =
          independentField === 'token0' ? amounts.amount1 : amounts.amount0

        // Convert dependent amount back to token units
        const dependentAmountStr = formatUnits(
          dependentAmountBigInt,
          dependentDecimals,
        )

        // Check for invalid results
        if (dependentAmountBigInt < 0n) {
          return {
            amount: '0',
            status: 'error',
            error: 'Invalid dependent amount calculated',
          }
        }

        return {
          amount: dependentAmountStr,
          status: 'within-range',
        }
      } catch (error) {
        console.error('Error calculating dependent amount:', error)
        return {
          amount: '0',
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },
    enabled: Boolean(poolAddress && initialized),
    staleTime: ms('10s'),
  })
}
