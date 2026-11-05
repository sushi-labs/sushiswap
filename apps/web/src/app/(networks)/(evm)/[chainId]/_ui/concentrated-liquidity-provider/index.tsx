'use client'

import {
  type FC,
  type ReactNode,
  useCallback,
  useMemo,
  useReducer,
} from 'react'
import { Bound, Field } from 'src/lib/constants'
import { type RangeTick, getTickToPrice } from 'src/lib/pool/cl'
import { useConcentratedLiquidityPool } from 'src/lib/wagmi/hooks/pools/hooks/use-concentrated-liquidity-pool'
import type { Price } from 'sushi'
import {
  type EvmCurrency,
  type EvmToken,
  Position,
  type SushiSwapV3ChainId,
  type SushiSwapV3FeeAmount,
  SushiSwapV3Pool,
  TICK_SPACINGS,
  TickMath,
  priceToClosestTick,
} from 'sushi/evm'
import {
  type Api,
  ConcentratedLiquidityActionsContext,
  ConcentratedLiquidityStateContext,
} from './context'
import {
  type RangePreset,
  concentratedLiquidityReducer,
  initialConcentratedLiquidityState,
} from './state'
import {
  type DerivedConcentratedMint,
  useDerivedConcentratedMint,
} from './use-derived-concentrated-mint'

export {
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
} from './context'

/*
  Provider only used whenever a user selects Concentrated Liquidity
 */
export const ConcentratedLiquidityProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    concentratedLiquidityReducer,
    initialConcentratedLiquidityState,
  )

  const api = useMemo((): Api => {
    function onFieldAInput(typedValue: string): void {
      dispatch({ type: 'typeInput', field: Field.CURRENCY_A, typedValue })
    }
    function onFieldBInput(typedValue: string): void {
      dispatch({ type: 'typeInput', field: Field.CURRENCY_B, typedValue })
    }
    function onStartPriceInput(
      typedValue: string,
      base: string | undefined,
    ): void {
      dispatch({ type: 'typeStartPriceInput', typedValue, base })
    }
    function setRangeBound(
      pair: string,
      bound: Bound,
      tick: RangeTick | undefined,
    ): void {
      dispatch({ type: 'setRangeBound', pair, bound, tick })
    }
    function setRange(
      pair: string,
      lower: RangeTick | undefined,
      upper: RangeTick | undefined,
      preset?: RangePreset,
    ): void {
      dispatch({ type: 'setRange', pair, lower, upper, preset })
    }
    function resetMintState(): void {
      dispatch({ type: 'resetMintState' })
    }
    function setWeightLockedCurrency0(
      pair: string,
      value: number | undefined,
    ): void {
      dispatch({ type: 'setWeightLockedCurrency0', pair, value })
    }

    return {
      resetMintState,
      onFieldAInput,
      onFieldBInput,
      onStartPriceInput,
      setRangeBound,
      setRange,
      setWeightLockedCurrency0,
    }
  }, [])

  return (
    <ConcentratedLiquidityActionsContext.Provider value={api}>
      <ConcentratedLiquidityStateContext.Provider value={state}>
        {children}
      </ConcentratedLiquidityStateContext.Provider>
    </ConcentratedLiquidityActionsContext.Provider>
  )
}

export function useConcentratedDerivedMintInfo({
  account,
  token0: currencyA,
  token1: currencyB,
  chainId,
  feeAmount,
  existingPosition,
}: {
  account: string | undefined
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  chainId: SushiSwapV3ChainId
  feeAmount: SushiSwapV3FeeAmount | undefined
  existingPosition?: Position
}): DerivedConcentratedMint<EvmToken, SushiSwapV3Pool, Position> &
  ReturnType<typeof useConcentratedLiquidityPool> & {
    pool?: SushiSwapV3Pool | null
    pricesAtLimit: {
      [_bound in Bound]?: Price<EvmToken, EvmToken> | undefined
    }
    noLiquidity: boolean
    errorMessage?: ReactNode
    invalidPool: boolean
    invertPrice: boolean
    /** The pool's tokens, sorted. */
    currency0: EvmToken | undefined
    currency1: EvmToken | undefined
    tickSpacing: number | undefined
  } {
  // V3 pools hold wrapped native
  const [tokenA, tokenB] = useMemo(
    () => [currencyA?.wrap(), currencyB?.wrap()],
    [currencyA, currencyB],
  )
  const [token0, token1] = useMemo(
    () =>
      tokenA && tokenB
        ? tokenA.sortsBefore(tokenB)
          ? [tokenA, tokenB]
          : [tokenB, tokenA]
        : [undefined, undefined],
    [tokenA, tokenB],
  )

  const usePool = useConcentratedLiquidityPool({
    chainId,
    token0: currencyA,
    token1: currencyB,
    feeAmount,
  })
  const { data: pool, isInitialLoading, isError } = usePool
  const noLiquidity = !isInitialLoading && !isError && !pool

  const invertPrice = Boolean(tokenA && token0 && !tokenA.isSame(token0))
  const tickSpacing = feeAmount ? TICK_SPACINGS[feeAmount] : undefined

  const poolPrice = useMemo(
    () => (pool && token0 ? pool.priceOf(token0) : undefined),
    [pool, token0],
  )
  const createPool = useCallback(
    (price: Price<EvmToken, EvmToken>) => {
      if (!tokenA || !tokenB || !feeAmount) return undefined
      const tick = priceToClosestTick(price)
      return new SushiSwapV3Pool(
        tokenA,
        tokenB,
        feeAmount,
        TickMath.getSqrtRatioAtTick(tick),
        0n,
        tick,
        [],
      )
    },
    [tokenA, tokenB, feeAmount],
  )

  const derived = useDerivedConcentratedMint({
    currencyA,
    currencyB,
    currency0: token0,
    currency1: token1,
    invertPrice,
    pool,
    poolPrice,
    noLiquidity,
    tickSpacing,
    createPool,
    positions: Position,
    existingPosition,
  })
  const { tickSpaceLimits, invalidPrice, parsedAmounts } = derived

  const pricesAtLimit = useMemo(
    () => ({
      [Bound.LOWER]: getTickToPrice(token0, token1, tickSpaceLimits.LOWER),
      [Bound.UPPER]: getTickToPrice(token0, token1, tickSpaceLimits.UPPER),
    }),
    [token0, token1, tickSpaceLimits.LOWER, tickSpaceLimits.UPPER],
  )

  let errorMessage: ReactNode | undefined
  if (!account) errorMessage = 'Connect Wallet'
  if (isError) errorMessage = errorMessage ?? 'Invalid pair'
  if (invalidPrice) errorMessage = errorMessage ?? 'Invalid price input'
  if (
    (!parsedAmounts[Field.CURRENCY_A] && !derived.depositADisabled) ||
    (!parsedAmounts[Field.CURRENCY_B] && !derived.depositBDisabled)
  ) {
    errorMessage = errorMessage ?? 'Enter an amount'
  }

  return {
    ...usePool,
    ...derived,
    pool,
    pricesAtLimit,
    noLiquidity,
    errorMessage,
    invalidPool: isError,
    invertPrice,
    currency0: token0,
    currency1: token1,
    tickSpacing,
  }
}
