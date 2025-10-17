import { useQuery } from '@tanstack/react-query'
import {
  type TickProcessed,
  useConcentratedActiveLiquidity,
} from 'src/lib/pool/v3'
import { Amount } from 'sushi'
import {
  type EvmCurrency,
  type EvmToken,
  type SushiSwapV3ChainId,
  type SushiSwapV3FeeAmount,
  SushiSwapV3Pool,
  TICK_SPACINGS,
  TickMath,
  tickToPrice,
} from 'sushi/evm'
import { maxUint128, stringify } from 'viem'
import type { ChartEntry } from './types'

async function calculateActiveRangeTokensLocked({
  token0,
  token1,
  feeAmount,
  tick,
  poolData,
}: {
  token0: EvmToken
  token1: EvmToken
  feeAmount: SushiSwapV3FeeAmount
  tick: TickProcessed
  poolData: {
    sqrtPriceX96?: bigint
    currentTick: number
    liquidity: bigint
  }
}): Promise<{ amount0Locked: number; amount1Locked: number } | undefined> {
  if (!poolData.currentTick || !poolData.sqrtPriceX96 || !poolData.liquidity) {
    return undefined
  }

  try {
    const liquidityGross =
      tick.liquidityNet >= 0n ? tick.liquidityNet : -tick.liquidityNet

    const mockTicks = [
      {
        index: tick.tick,
        liquidityGross,
        liquidityNet: -tick.liquidityNet,
      },
      {
        index: tick.tick + TICK_SPACINGS[feeAmount],
        liquidityGross,
        liquidityNet: tick.liquidityNet,
      },
    ]

    // Initialize pool containing only the active range
    const pool1 = new SushiSwapV3Pool(
      token0,
      token1,
      feeAmount,
      poolData.sqrtPriceX96,
      tick.liquidityActive,
      poolData.currentTick,
      mockTicks,
    )
    const tickPrice = tickToPrice(token0, token1, poolData.currentTick)

    // Calculate amount of token0 that would need to be swapped to reach the bottom of the range
    const bottomOfRangePrice = TickMath.getSqrtRatioAtTick(mockTicks[0].index)
    const maxAmountToken0 = new Amount(token0, maxUint128)

    const token1Amount = (
      await pool1.getOutputAmount(maxAmountToken0, bottomOfRangePrice)
    )[0]
    const amount0Locked = +tickPrice
      .invert()
      .getQuote(token1Amount)
      .toSignificant()

    // Calculate amount of token1 that would need to be swapped to reach the top of the range
    const topOfRangePrice = TickMath.getSqrtRatioAtTick(mockTicks[1].index)
    const maxAmountToken1 = new Amount(token1, maxUint128)
    const token0Amount = (
      await pool1.getOutputAmount(maxAmountToken1, topOfRangePrice)
    )[0]
    const amount1Locked = +tickPrice.getQuote(token0Amount).toSignificant()

    return { amount0Locked, amount1Locked }
  } catch {
    return { amount0Locked: 0, amount1Locked: 0 }
  }
}

async function calculateTokensLocked({
  token0,
  token1,
  feeAmount,
  tick,
}: {
  token0: EvmToken
  token1: EvmToken
  feeAmount: SushiSwapV3FeeAmount
  tick: TickProcessed
}) {
  try {
    const tickSpacing = TICK_SPACINGS[feeAmount]
    const liquidityNet = tick.liquidityNet
    const liquidityGross = liquidityNet >= 0n ? liquidityNet : -liquidityNet
    const sqrtPriceX96 = TickMath.getSqrtRatioAtTick(tick.tick)

    const mockTicks = [
      {
        index: tick.tick,
        liquidityGross,
        liquidityNet: -tick.liquidityNet,
      },
      {
        index: tick.tick + tickSpacing,
        liquidityGross,
        liquidityNet: tick.liquidityNet,
      },
    ]

    // Pool containing only the current range
    const pool = new SushiSwapV3Pool(
      token0,
      token1,
      feeAmount,
      sqrtPriceX96,
      tick.liquidityActive,
      tick.tick,
      mockTicks,
    )

    const nextSqrtX96 = TickMath.getSqrtRatioAtTick(tick.tick - tickSpacing)
    const maxAmountToken0 = new Amount(token0, maxUint128)
    const token1Amount = (
      await pool.getOutputAmount(maxAmountToken0, nextSqrtX96)
    )[0]

    const amount1Locked = +token1Amount.toSignificant()

    const tickPrice = tickToPrice(token0, token1, tick.tick)

    const amount0Locked = +tickPrice
      .invert()
      .getQuote(token1Amount)
      .toSignificant()

    return { amount0Locked, amount1Locked }
  } catch {
    return { amount0Locked: 0, amount1Locked: 0 }
  }
}

interface UseLiquidityBarData {
  chainId: SushiSwapV3ChainId
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  feeAmount: SushiSwapV3FeeAmount | undefined
  enabled?: boolean
}

export function useLiquidityBarData({
  chainId,
  token0,
  token1,
  feeAmount,
  enabled = true,
}: UseLiquidityBarData) {
  const activeLiquidity = useConcentratedActiveLiquidity({
    chainId,
    token0,
    token1,
    feeAmount,
    enabled,
  })

  const liquidityBarsQuery = useQuery({
    enabled:
      enabled &&
      !!activeLiquidity.data &&
      !!token0 &&
      !!token1 &&
      feeAmount !== undefined,
    queryKey: [
      'v3-bars',
      {
        chainId,
        token0,
        token1,
        feeAmount,
        length: activeLiquidity.data?.length,
        currentTick: activeLiquidity.currentTick,
        liquidity: activeLiquidity.liquidity,
        sqrtPriceX96: activeLiquidity.sqrtPriceX96,
        activeTick: activeLiquidity.activeTick,
      },
    ],
    queryKeyHashFn: stringify,
    queryFn: async () => {
      if (!activeLiquidity.data || !token0 || !token1 || !feeAmount)
        throw new Error(null as never)

      const isReversed = true // xxTODO (fuck you codex)

      let activeRangePercentage: number | undefined = undefined
      let activeRangeIndex: number | undefined = undefined

      const barData = await Promise.all(
        activeLiquidity.data.map(async (tick, index) => {
          // based on index
          const fakeTime = isReversed
            ? index * 1000
            : (activeLiquidity.data.length - index) * 1000
          const isActive = activeLiquidity.activeTick === tick.tick

          let price0 = tickToPrice(token0.wrap(), token1.wrap(), tick.tick)
          let price1 = price0.invert()

          if (
            isActive &&
            activeLiquidity.activeTick &&
            activeLiquidity.currentTick
          ) {
            activeRangeIndex = index
            activeRangePercentage =
              (activeLiquidity.currentTick - tick.tick) /
              TICK_SPACINGS[feeAmount]

            price0 = tickToPrice(token0.wrap(), token1.wrap(), tick.tick)
            price1 = price0.invert()
          }

          const { amount0Locked, amount1Locked } = await calculateTokensLocked({
            token0: token0.wrap(),
            token1: token1.wrap(),
            feeAmount,
            tick,
          })

          return {
            tick: tick.tick,
            liquidity: Number(tick.liquidityActive),
            price0: +price0.toSignificant(),
            price1: +price1.toSignificant(),
            time: fakeTime,
            amount0Locked,
            amount1Locked,
          } satisfies ChartEntry
        }),
      )

      // offset previous bar with next bar’s locked amounts (Uniswap behavior)
      for (let i = 1; i < barData.length; i++) {
        barData[i - 1].amount0Locked = barData[i].amount0Locked
        barData[i - 1].amount1Locked = barData[i].amount1Locked
      }

      const activeRangeData =
        activeRangeIndex !== undefined ? barData[activeRangeIndex] : undefined

      // For active range, adjust amounts locked to adjust for where current tick/price is within the range
      if (activeRangeIndex !== undefined && activeRangeData) {
        const activeTickTvl = await calculateActiveRangeTokensLocked({
          token0: token0.wrap(),
          token1: token1.wrap(),
          feeAmount,
          tick: activeLiquidity.data[activeRangeIndex],
          poolData: {
            currentTick: activeLiquidity.currentTick,
            liquidity: activeLiquidity.liquidity,
            sqrtPriceX96: activeLiquidity.sqrtPriceX96,
          },
        })
        barData[activeRangeIndex] = { ...activeRangeData, ...activeTickTvl }
      }

      // Reverse data so that token0 is on the left by default
      if (!isReversed) {
        barData.reverse()
      }

      return {
        barData: barData.filter((t) => t.liquidity > 0),
        activeRangeData,
        activeRangePercentage,
      }
    },
  })

  return {
    tickData: liquidityBarsQuery.data,
    activeTick: activeLiquidity.activeTick,
    isLoading:
      activeLiquidity.isLoading ||
      liquidityBarsQuery.isLoading ||
      !liquidityBarsQuery.data,
    isError: liquidityBarsQuery.error || activeLiquidity.error,
  }
}
