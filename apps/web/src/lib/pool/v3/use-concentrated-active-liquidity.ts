'use client'

import { useMemo } from 'react'
import {
  type EvmCurrency,
  type SushiSwapV3ChainId,
  type SushiSwapV3FeeAmount,
  TICK_SPACINGS,
  tickToPrice,
} from 'sushi/evm'

import { useConcentratedLiquidityPool } from 'src/lib/wagmi/hooks/pools/hooks/useConcentratedLiquidityPool'
import computeSurroundingTicks from '../../functions'
import { useTicks } from './use-ticks'

const PRICE_FIXED_DIGITS = 8

export interface TickProcessed {
  tick: number
  liquidityActive: bigint
  liquidityNet: bigint
  price0: string
  price1: string
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

    const _token0 = token0.wrap()
    const _token1 = token1.wrap()

    // find where the active tick would be to partition the array
    // if the active tick is initialized, the pivot will be an element
    // if not, take the previous tick as pivot
    const pivot = ticks.findIndex(({ tickIdx }) => tickIdx > activeTick) - 1

    if (pivot < 0) {
      // consider setting a local error
      console.error('TickData pivot not found')
      return {
        isLoading,
        error,
        activeTick,
        data: undefined,
      }
    }

    const activeTickProcessed: TickProcessed = {
      liquidityActive: BigInt(pool?.liquidity.toString()) ?? 0n,
      tick: activeTick,
      liquidityNet:
        Number(ticks[pivot].tickIdx) === activeTick
          ? ticks[pivot].liquidityNet
          : 0n,
      price0: tickToPrice(_token0, _token1, activeTick).toString({
        fixed: PRICE_FIXED_DIGITS,
      }),
      price1: tickToPrice(_token1, _token0, activeTick).toString({
        fixed: PRICE_FIXED_DIGITS,
      }),
    }

    const subsequentTicks = computeSurroundingTicks(
      _token0,
      _token1,
      activeTickProcessed,
      ticks,
      pivot,
      true,
    )
    const previousTicks = computeSurroundingTicks(
      _token0,
      _token1,
      activeTickProcessed,
      ticks,
      pivot,
      false,
    )
    const ticksProcessed = previousTicks
      .concat(activeTickProcessed)
      .concat(subsequentTicks)

    return {
      isLoading,
      error,
      activeTick,
      data: ticksProcessed,
    }
  }, [token0, token1, activeTick, pool, ticks, isLoading, error, isPoolLoading])
}
