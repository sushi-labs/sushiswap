'use client'

import { useCallback, useMemo } from 'react'
import type { Price } from 'sushi'
import {
  type EvmAddress,
  type EvmCurrency,
  SushiSwapV4Pool,
  SushiSwapV4Position,
  TickMath,
  encodeSqrtRatioX96,
  sortSushiSwapV4Currencies,
} from 'sushi/evm'
import {
  type DerivedConcentratedMint,
  useDerivedConcentratedMint,
} from '~evm/[chainId]/_ui/concentrated-liquidity-provider/use-derived-concentrated-mint'

export interface V4PoolConfig {
  fee: number
  tickSpacing: number
  poolManager: EvmAddress
}

interface UseV4DerivedMintInfoParams {
  currencyA: EvmCurrency | undefined
  currencyB: EvmCurrency | undefined
  /** The pool; null when it is not initialized, undefined while loading. */
  pool: SushiSwapV4Pool | null | undefined
  isPoolLoading: boolean
  /** How to create the pool when it does not exist. */
  poolConfig: V4PoolConfig | undefined
  existingPosition?: SushiSwapV4Position | undefined
}

export interface V4DerivedMintInfo
  extends DerivedConcentratedMint<
    EvmCurrency,
    SushiSwapV4Pool,
    SushiSwapV4Position
  > {
  /** The pair's currencies, sorted; unset for a pair of the same currency. */
  currency0: EvmCurrency | undefined
  currency1: EvmCurrency | undefined
  pool: SushiSwapV4Pool | null | undefined
  noLiquidity: boolean
  tickSpacing: number | undefined
  /** Whether currencyA is currency1, so typed prices are of currency1. */
  invertPrice: boolean
  isLoading: boolean
}

/**
 * Derives the range, amounts and position a V4 mint or increase would
 * produce from the concentrated liquidity form state, as V3's
 * `useConcentratedDerivedMintInfo` does.
 */
export function useV4DerivedMintInfo({
  currencyA,
  currencyB,
  pool,
  isPoolLoading,
  poolConfig,
  existingPosition,
}: UseV4DerivedMintInfoParams): V4DerivedMintInfo {
  const [currency0, currency1] = useMemo(
    () =>
      currencyA && currencyB && !currencyA.isSame(currencyB)
        ? sortSushiSwapV4Currencies(currencyA, currencyB)
        : [undefined, undefined],
    [currencyA, currencyB],
  )

  const noLiquidity = !isPoolLoading && pool === null
  const tickSpacing = pool?.tickSpacing ?? poolConfig?.tickSpacing
  const invertPrice = Boolean(
    currencyA && currency0 && !currencyA.isSame(currency0),
  )

  const createPool = useCallback(
    (price: Price<EvmCurrency, EvmCurrency>) => {
      if (!currencyA || !currencyB || !poolConfig) return undefined
      const sqrtRatioX96 = encodeSqrtRatioX96(
        price.numerator,
        price.denominator,
      )
      return new SushiSwapV4Pool({
        currencyA,
        currencyB,
        ...poolConfig,
        sqrtRatioX96,
        liquidity: 0n,
        tickCurrent: TickMath.getTickAtSqrtRatio(sqrtRatioX96),
      })
    },
    [currencyA, currencyB, poolConfig],
  )

  const derived = useDerivedConcentratedMint({
    currencyA,
    currencyB,
    currency0,
    currency1,
    invertPrice,
    pool,
    poolPrice: pool?.currency0Price,
    noLiquidity,
    tickSpacing,
    createPool,
    positions: SushiSwapV4Position,
    existingPosition,
  })

  return {
    ...derived,
    currency0,
    currency1,
    pool,
    noLiquidity,
    tickSpacing,
    invertPrice,
    isLoading: isPoolLoading,
  }
}
