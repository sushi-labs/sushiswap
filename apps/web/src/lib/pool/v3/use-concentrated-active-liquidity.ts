'use client'

import { useMemo } from 'react'
import {
  type EvmCurrency,
  type SushiSwapV3ChainId,
  type SushiSwapV3FeeAmount,
  TICK_SPACINGS,
} from 'sushi/evm'

import { useConcentratedLiquidityPool } from 'src/lib/wagmi/hooks/pools/hooks/use-concentrated-liquidity-pool'
import computeSurroundingTicks, { tickToPoolPrice } from '../../functions'
import { useTicks } from './use-ticks'

const PRICE_FIXED_DIGITS = 8

export interface TickProcessed {
  tick: number
  liquidityActive: bigint
  liquidityNet: bigint
  price0: string
}

/**
 * Active liquidity at every initialized tick, walking outwards from the
 * active tick. `ticks` must be sorted by `tickIdx` ascending. Pass the
 * currencies as the pool holds them: wrapped for V3, native as-is for V4.
 */
export function processActiveLiquidity({
  token0,
  token1,
  activeTick,
  liquidity,
  ticks,
}: {
  token0: EvmCurrency
  token1: EvmCurrency
  activeTick: number
  liquidity: bigint
  ticks: { tickIdx: number; liquidityNet: bigint }[]
}): TickProcessed[] | undefined {
  if (ticks.length === 0) return undefined

  // find where the active tick would be to partition the array
  // if the active tick is initialized, the pivot will be an element
  // if not, take the previous tick as pivot (-1 below the first tick,
  // the last tick when above every initialized tick)
  const nextTickIndex = ticks.findIndex(({ tickIdx }) => tickIdx > activeTick)
  const pivot = (nextTickIndex === -1 ? ticks.length : nextTickIndex) - 1

  const activeTickProcessed: TickProcessed = {
    liquidityActive: liquidity,
    tick: activeTick,
    liquidityNet:
      pivot >= 0 && Number(ticks[pivot].tickIdx) === activeTick
        ? ticks[pivot].liquidityNet
        : 0n,
    price0: tickToPoolPrice(token0, token1, activeTick).toString({
      fixed: PRICE_FIXED_DIGITS,
    }),
  }

  const subsequentTicks = computeSurroundingTicks(
    token0,
    token1,
    activeTickProcessed,
    ticks,
    pivot,
    true,
  )
  const previousTicks = computeSurroundingTicks(
    token0,
    token1,
    activeTickProcessed,
    ticks,
    pivot,
    false,
  )

  return previousTicks.concat(activeTickProcessed).concat(subsequentTicks)
}

const getActiveTick = (
  tickCurrent: number | undefined,
  feeAmount: SushiSwapV3FeeAmount | undefined,
) =>
  tickCurrent !== undefined && feeAmount
    ? Math.floor(tickCurrent / TICK_SPACINGS[feeAmount]) *
      TICK_SPACINGS[feeAmount]
    : undefined

const useAllV3Ticks = ({
  token0,
  token1,
  feeAmount,
  chainId,
}: {
  chainId: SushiSwapV3ChainId
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  feeAmount: SushiSwapV3FeeAmount | undefined
}) => {
  // TODO: Add subgraph support
  return useTicks({ token0, token1, feeAmount, chainId })
}

export const useConcentratedActiveLiquidity = ({
  token0,
  token1,
  feeAmount,
  chainId,
  enabled = true,
}: {
  chainId: SushiSwapV3ChainId
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  feeAmount: SushiSwapV3FeeAmount | undefined
  enabled?: boolean
}) => {
  const { data: pool, isLoading: isPoolLoading } = useConcentratedLiquidityPool(
    {
      chainId,
      token0,
      token1,
      feeAmount,
      enabled,
    },
  )

  // Find nearest valid tick for pool in case tick is not initialized.
  const activeTick = useMemo(
    () => getActiveTick(pool?.tickCurrent, feeAmount),
    [pool, feeAmount],
  )
  const {
    isLoading,
    error,
    data: ticks,
  } = useAllV3Ticks({ token0, token1, feeAmount, chainId })

  return useMemo(() => {
    if (
      !token0 ||
      !token1 ||
      activeTick === undefined ||
      !pool ||
      !ticks ||
      ticks.length === 0 ||
      isLoading
    ) {
      return {
        isLoading: isLoading || isPoolLoading,
        error,
        activeTick,
        data: undefined,
      }
    }

    const ticksProcessed = processActiveLiquidity({
      token0: token0.wrap(),
      token1: token1.wrap(),
      activeTick,
      liquidity: BigInt(pool.liquidity.toString()),
      ticks,
    })

    if (!ticksProcessed) {
      return {
        isLoading,
        error,
        activeTick,
        data: undefined,
      }
    }

    return {
      isLoading,
      error,
      activeTick,
      data: ticksProcessed,
    }
  }, [token0, token1, activeTick, pool, ticks, isLoading, error, isPoolLoading])
}
