'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { StellarContractAddress } from 'sushi/stellar'
import { getCurrentSqrtPrice } from '../../soroban/pool-helpers'
import { getLiquidityAmounts } from '../../utils/liquidity-amounts'
import { usePoolInitialized } from './use-pool-initialized'

export function useMaxPairedAmount(
  poolAddress: StellarContractAddress | null,
  token0Balance: string,
  token1Balance: string,
  tickLower: number | null,
  tickUpper: number | null,
  _token0Decimals: number,
  _token1Decimals: number,
): UseQueryResult<{ maxToken0Amount: string; maxToken1Amount: string }, Error> {
  const { data: initialized } = usePoolInitialized(poolAddress)
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
    ],
    queryFn: async () => {
      if (!poolAddress || tickLower === null || tickUpper === null)
        throw new Error('Pool and range required')
      const price = await getCurrentSqrtPrice(poolAddress)
      const amounts = getLiquidityAmounts(
        price,
        tickLower,
        tickUpper,
        BigInt(token0Balance),
        BigInt(token1Balance),
      )
      return {
        maxToken0Amount: amounts.amount0.toString(),
        maxToken1Amount: amounts.amount1.toString(),
      }
    },
    enabled: Boolean(
      poolAddress &&
        initialized &&
        tickLower !== null &&
        tickUpper !== null &&
        tickLower < tickUpper,
    ),
    staleTime: ms('10s'),
  })
}
