'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { StellarContractAddress } from 'sushi/stellar'
import { getCurrentSqrtPrice } from '../../soroban/pool-helpers'
import {
  type DependentAmount,
  type LiquidityField,
  calculateDependentAmount,
} from '../../utils/liquidity-amounts'
import { usePoolInitialized } from './use-pool-initialized'

export type Field = LiquidityField

export function useCalculateDependentAmount(
  poolAddress: StellarContractAddress | null,
  amount: string,
  independentField: Field,
  tickLower: number,
  tickUpper: number,
  independentDecimals: number,
  dependentDecimals: number,
  proposedSqrtPriceX96?: bigint,
): UseQueryResult<DependentAmount, Error> {
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
      independentDecimals,
      dependentDecimals,
      proposedSqrtPriceX96?.toString(),
    ],
    queryFn: async () => {
      const price =
        proposedSqrtPriceX96 ??
        (poolAddress ? await getCurrentSqrtPrice(poolAddress) : undefined)
      if (price === undefined) throw new Error('Pool price unavailable')
      return calculateDependentAmount(
        amount,
        independentField,
        independentDecimals,
        dependentDecimals,
        price,
        tickLower,
        tickUpper,
      )
    },
    enabled:
      proposedSqrtPriceX96 !== undefined || Boolean(poolAddress && initialized),
    staleTime: ms('10s'),
  })
}
