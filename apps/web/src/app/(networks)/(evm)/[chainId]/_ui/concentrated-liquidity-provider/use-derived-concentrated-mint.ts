'use client'

import { useMemo } from 'react'
import { Bound, Field } from 'src/lib/constants'
import { Amount, type Price } from 'sushi'
import { type EvmCurrency, TickMath, encodeSqrtRatioX96 } from 'sushi/evm'
import { useConcentratedMintState } from './context'
import {
  type ConcentratedRange,
  getDepositsDisabled,
  parseStartPrice,
  useConcentratedRange,
} from './use-concentrated-range'

interface PositionArgs<TPool> {
  pool: TPool
  tickLower: number
  tickUpper: number
}

/** A V3 or V4 SDK position class, by the factories it shares. */
export interface ConcentratedPositionFactory<TPool, TPosition> {
  fromAmounts(
    args: PositionArgs<TPool> & {
      amount0: bigint
      amount1: bigint
      useFullPrecision: boolean
    },
  ): TPosition
  fromAmount0(
    args: PositionArgs<TPool> & { amount0: bigint; useFullPrecision: boolean },
  ): TPosition
  fromAmount1(args: PositionArgs<TPool> & { amount1: bigint }): TPosition
}

interface ConcentratedPosition {
  amount0: Amount<EvmCurrency>
  amount1: Amount<EvmCurrency>
}

interface UseDerivedConcentratedMintParams<
  TCurrency extends EvmCurrency,
  TPool,
  TPosition,
> {
  /** The form's currencies, as entered. */
  currencyA: EvmCurrency | undefined
  currencyB: EvmCurrency | undefined
  /** The pool's currencies, sorted as it prices them. */
  currency0: TCurrency | undefined
  currency1: TCurrency | undefined
  /** Whether currencyA is the pool's currency1, so typed prices invert. */
  invertPrice: boolean
  pool: TPool | null | undefined
  /** The pool's price of currency0. */
  poolPrice: Price<TCurrency, TCurrency> | undefined
  noLiquidity: boolean
  tickSpacing: number | undefined
  /** The pool a start price would create; must be stable across renders. */
  createPool(price: Price<TCurrency, TCurrency>): TPool | undefined
  positions: ConcentratedPositionFactory<TPool, TPosition>
  existingPosition?: { tickLower: number; tickUpper: number } | undefined
}

export interface DerivedConcentratedMint<
  TCurrency extends EvmCurrency,
  TPool,
  TPosition,
> extends ConcentratedRange<TCurrency> {
  currencies: { [_field in Field]: EvmCurrency | undefined }
  dependentField: Field
  /** The pool's price of currency0, or the typed start price. */
  price: Price<TCurrency, TCurrency> | undefined
  /** The price is outside what a pool can hold. */
  invalidPrice: boolean
  /** The pool, or for a pool to create, one at the typed start price. */
  poolForPosition: TPool | undefined
  parsedAmounts: { [_field in Field]: Amount<EvmCurrency> | undefined }
  depositADisabled: boolean
  depositBDisabled: boolean
  position: TPosition | undefined
}

/**
 * Derives the price, range, amounts and position a V3 or V4 mint would
 * produce from the concentrated liquidity form state. Prices are of
 * currency0 in currency1.
 */
export function useDerivedConcentratedMint<
  TCurrency extends EvmCurrency,
  TPool extends { sqrtRatioX96: bigint },
  TPosition extends ConcentratedPosition,
>({
  currencyA,
  currencyB,
  currency0,
  currency1,
  invertPrice,
  pool,
  poolPrice,
  noLiquidity,
  tickSpacing,
  createPool,
  positions,
  existingPosition,
}: UseDerivedConcentratedMintParams<
  TCurrency,
  TPool,
  TPosition
>): DerivedConcentratedMint<TCurrency, TPool, TPosition> {
  const {
    independentField,
    typedValue,
    range,
    startPriceTypedValue,
    startPriceBase,
  } = useConcentratedMintState()

  const dependentField =
    independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A

  const currencies = useMemo(
    () => ({ [Field.CURRENCY_A]: currencyA, [Field.CURRENCY_B]: currencyB }),
    [currencyA, currencyB],
  )

  const price = useMemo(
    () =>
      noLiquidity
        ? parseStartPrice({
            currency0,
            currency1,
            typedValue: startPriceTypedValue,
            base: startPriceBase,
            invertPrice,
          })
        : poolPrice,
    [
      noLiquidity,
      poolPrice,
      currency0,
      currency1,
      startPriceTypedValue,
      startPriceBase,
      invertPrice,
    ],
  )

  const invalidPrice = useMemo(() => {
    if (!price) return false
    const sqrtRatioX96 = encodeSqrtRatioX96(price.numerator, price.denominator)
    return (
      sqrtRatioX96 < TickMath.MIN_SQRT_RATIO ||
      sqrtRatioX96 >= TickMath.MAX_SQRT_RATIO
    )
  }, [price])

  // The pool the typed start price would create, for amounts before it exists
  const mockPool = useMemo(() => {
    if (!noLiquidity || !price || invalidPrice) return undefined
    try {
      return createPool(price)
    } catch {
      return undefined
    }
  }, [noLiquidity, price, invalidPrice, createPool])

  const poolForPosition = pool ?? mockPool

  const concentratedRange = useConcentratedRange({
    currency0,
    currency1,
    price,
    invertPrice,
    tickSpacing,
    existingTicks: existingPosition,
    range,
  })
  const { ticks, invalidRange, outOfRange } = concentratedRange
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks

  const independentAmount = useMemo(() => {
    const currency = currencies[independentField]
    return currency && typedValue
      ? Amount.tryFromHuman(currency, typedValue)
      : undefined
  }, [currencies, independentField, typedValue])

  // currencyA is currency0 unless prices invert
  const isCurrencyA0 = !invertPrice

  const dependentAmount = useMemo(() => {
    const dependentCurrency = currencies[dependentField]
    if (
      !independentAmount ||
      independentAmount.amount === 0n ||
      !dependentCurrency ||
      tickLower === undefined ||
      tickUpper === undefined ||
      !poolForPosition ||
      // Out of range positions take a single currency
      outOfRange ||
      invalidRange
    ) {
      return undefined
    }

    const isIndependent0 =
      (independentField === Field.CURRENCY_A) === isCurrencyA0
    try {
      const args = { pool: poolForPosition, tickLower, tickUpper }
      const position = isIndependent0
        ? positions.fromAmount0({
            ...args,
            amount0: independentAmount.amount,
            useFullPrecision: true,
          })
        : positions.fromAmount1({ ...args, amount1: independentAmount.amount })
      return new Amount(
        dependentCurrency,
        isIndependent0 ? position.amount1.amount : position.amount0.amount,
      )
    } catch {
      return undefined
    }
  }, [
    currencies,
    dependentField,
    independentField,
    independentAmount,
    isCurrencyA0,
    tickLower,
    tickUpper,
    poolForPosition,
    positions,
    outOfRange,
    invalidRange,
  ])

  const parsedAmounts = useMemo(
    () =>
      independentField === Field.CURRENCY_A
        ? {
            [Field.CURRENCY_A]: independentAmount,
            [Field.CURRENCY_B]: dependentAmount,
          }
        : {
            [Field.CURRENCY_A]: dependentAmount,
            [Field.CURRENCY_B]: independentAmount,
          },
    [dependentAmount, independentAmount, independentField],
  )

  // Single sided deposits when the price is outside the range
  const { deposit0Disabled, deposit1Disabled } = getDepositsDisabled({
    sqrtRatioX96: poolForPosition?.sqrtRatioX96,
    tickLower,
    tickUpper,
  })
  const depositADisabled =
    invalidRange || (isCurrencyA0 ? deposit0Disabled : deposit1Disabled)
  const depositBDisabled =
    invalidRange || (isCurrencyA0 ? deposit1Disabled : deposit0Disabled)

  const position = useMemo(() => {
    if (
      !poolForPosition ||
      tickLower === undefined ||
      tickUpper === undefined ||
      invalidRange
    ) {
      return undefined
    }

    const amountA = parsedAmounts[Field.CURRENCY_A]?.amount
    const amountB = parsedAmounts[Field.CURRENCY_B]?.amount
    const amount0 = deposit0Disabled ? 0n : isCurrencyA0 ? amountA : amountB
    const amount1 = deposit1Disabled ? 0n : isCurrencyA0 ? amountB : amountA
    if (amount0 === undefined || amount1 === undefined) return undefined

    try {
      return positions.fromAmounts({
        pool: poolForPosition,
        tickLower,
        tickUpper,
        amount0,
        amount1,
        useFullPrecision: true,
      })
    } catch {
      return undefined
    }
  }, [
    poolForPosition,
    positions,
    tickLower,
    tickUpper,
    invalidRange,
    parsedAmounts,
    deposit0Disabled,
    deposit1Disabled,
    isCurrencyA0,
  ])

  return {
    ...concentratedRange,
    currencies,
    dependentField,
    price,
    invalidPrice,
    poolForPosition,
    parsedAmounts,
    depositADisabled,
    depositBDisabled,
    position,
  }
}
