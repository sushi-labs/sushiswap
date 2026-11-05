'use client'

import { useMemo } from 'react'
import {
  type EvmCurrency,
  type SushiSwapV3ChainId,
  type SushiSwapV3FeeAmount,
  TICK_SPACINGS,
} from 'sushi/evm'

import { useConcentratedLiquidityPool } from 'src/lib/wagmi/hooks/pools/hooks/use-concentrated-liquidity-pool'
import { processActiveLiquidity } from '../cl'
import { useTicks } from './use-ticks'

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
