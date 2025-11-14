'use client'

import { useQuery } from '@tanstack/react-query'
import { formatTokenAmount } from '../../utils/format'
import { useCalculatePairedAmount } from './use-calculate-paired-amount'
import { usePoolInitialized } from './use-pool-initialized'

/**
 * Calculate the maximum token0 and token1 amounts based on token0 and token1 balances
 */
export function useMaxPairedAmount(
  poolAddress: string | null,
  token0Balance: string,
  token1Balance: string,
  tickLower: number,
  tickUpper: number,
  token0Decimals: number,
  token1Decimals: number,
) {
  const { data: initialized } = usePoolInitialized(poolAddress)
  const { data: pairedAmountData } = useCalculatePairedAmount(
    poolAddress,
    formatTokenAmount(BigInt(token0Balance), token0Decimals),
    tickLower,
    tickUpper,
    token0Decimals,
  )
  const rawPairedToken1Amount = BigInt(
    Math.floor(
      Number.parseFloat(pairedAmountData?.token1Amount || '0') *
        10 ** token1Decimals,
    ),
  )
  return useQuery({
    queryKey: [
      'pool',
      'maxPairedAmount',
      poolAddress,
      token0Balance,
      token1Balance,
      tickLower,
      tickUpper,
      token0Decimals,
      token1Decimals,
    ],
    queryFn: async () => {
      if (
        !poolAddress ||
        !token0Balance ||
        !token1Balance ||
        !rawPairedToken1Amount ||
        !initialized
      ) {
        return {
          maxToken0Amount: '0',
          maxToken1Amount: '0',
        }
      }
      try {
        return {
          maxToken0Amount:
            rawPairedToken1Amount < BigInt(token1Balance)
              ? token0Balance
              : (
                  (BigInt(token1Balance) * BigInt(token0Balance)) /
                  rawPairedToken1Amount
                ).toString(),
          maxToken1Amount:
            rawPairedToken1Amount < BigInt(token1Balance)
              ? rawPairedToken1Amount.toString()
              : token1Balance,
        }
      } catch (error) {
        console.error('Error calculating max paired amounts', error)
        throw error
      }
    },
    enabled:
      !!poolAddress &&
      !!token0Balance &&
      !!token1Balance &&
      !!pairedAmountData &&
      !!initialized,
    staleTime: 10000, // 10 seconds
  })
}
