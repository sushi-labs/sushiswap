'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { StellarContractAddress, StellarToken } from 'sushi/stellar'
import { formatUnits, parseUnits } from 'viem'
import { useCalculateDependentAmount } from './use-calculate-dependent-amount'
import { usePoolInitialized } from './use-pool-initialized'

/**
 * Calculate the maximum token0 and token1 amounts based on token0 and token1 balances
 */
export function useMaxPairedAmount(
  poolAddress: StellarContractAddress | null,
  token0Balance: string,
  token1Balance: string,
  tickLower: number | null,
  tickUpper: number | null,
  token0: StellarToken | undefined,
  token1: StellarToken | undefined,
) {
  const { data: initialized } = usePoolInitialized(poolAddress)
  const { data: pairedAmountData } = useCalculateDependentAmount(
    poolAddress,
    token0 ? formatUnits(BigInt(token0Balance), token0.decimals) : '0',
    'token0',
    tickLower,
    tickUpper,
    token0,
    token1,
  )
  const rawPairedToken1Amount = token1
    ? parseUnits(pairedAmountData?.amount || '0', token1.decimals)
    : 0n
  return useQuery({
    queryKey: [
      'stellar',
      'pool',
      'maxPairedAmount',
      poolAddress,
      token0Balance,
      token1Balance,
      tickLower,
      tickUpper,
      token0?.id,
      token1?.id,
    ],
    queryFn: async () => {
      if (
        !poolAddress ||
        !token0Balance ||
        !token1Balance ||
        !initialized ||
        !token0 ||
        !token1 ||
        tickLower === null ||
        tickUpper === null ||
        !pairedAmountData ||
        pairedAmountData.status === 'idle' ||
        pairedAmountData.status === 'error'
      ) {
        return {
          maxToken0Amount: '0',
          maxToken1Amount: '0',
        }
      }
      if (pairedAmountData.status === 'below-range') {
        return {
          maxToken0Amount: token0Balance,
          maxToken1Amount: '0',
        }
      }
      if (pairedAmountData.status === 'above-range') {
        return {
          maxToken0Amount: '0',
          maxToken1Amount: token1Balance,
        }
      }
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
    },
    enabled: Boolean(
      poolAddress &&
        token0Balance &&
        token1Balance &&
        pairedAmountData &&
        initialized &&
        token0 &&
        token1 &&
        tickLower !== null &&
        tickUpper !== null,
    ),
    staleTime: ms('10s'),
  })
}
