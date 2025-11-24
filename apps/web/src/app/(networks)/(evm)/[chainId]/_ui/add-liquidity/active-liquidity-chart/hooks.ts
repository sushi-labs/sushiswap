import { useMemo } from 'react'
import {
  type TickProcessed,
  useConcentratedActiveLiquidity,
} from 'src/lib/pool/v3'
import { Amount } from 'sushi'
import {
  type EvmCurrency,
  SqrtPriceMath,
  type SushiSwapV3ChainId,
  type SushiSwapV3FeeAmount,
  TICK_SPACINGS,
  TickMath,
} from 'sushi/evm'
import type { ChartEntry } from '../active-liquidity-chart/types'

interface UseDensityChartData {
  chainId: SushiSwapV3ChainId
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  feeAmount: SushiSwapV3FeeAmount | undefined
  enabled?: boolean
}

export function useDensityChartData({
  chainId,
  token0,
  token1,
  feeAmount,
  enabled = true,
}: UseDensityChartData) {
  const activeLiquidity = useConcentratedActiveLiquidity({
    chainId,
    token0,
    token1,
    feeAmount,
    enabled,
  })

  return useMemo(() => {
    const data = activeLiquidity.data
    if (!data) return activeLiquidity

    const newData: ChartEntry[] = []
    for (let i = 0; i < data.length; i++) {
      const t: TickProcessed = data[i]
      let {
        amount0Locked,
        amount1Locked,
      }: {
        amount0Locked: number | undefined
        amount1Locked: number | undefined
      } = { amount0Locked: undefined, amount1Locked: undefined }
      if (
        token0 &&
        token1 &&
        feeAmount !== undefined &&
        activeLiquidity.activeTick !== undefined
      ) {
        ;({ amount0Locked, amount1Locked } = calculateTokensLocked({
          token0: token0,
          token1: token1,
          tickSpacing: TICK_SPACINGS[feeAmount],
          currentTick: activeLiquidity.activeTick,
          amount: t.liquidityActive,
          tick: t,
        }))
      }
      const chartEntry = {
        activeLiquidity: Number.parseFloat(t.liquidityActive.toString()),
        price0: Number.parseFloat(t.price0),
        price1: Number.parseFloat(t.price1),
        tick: t.tick,
        amount0Locked: amount0Locked,
        amount1Locked: amount1Locked,
      }

      if (chartEntry.activeLiquidity > 0) {
        newData.push(chartEntry)
      }
    }

    return {
      ...activeLiquidity,
      data: newData,
    }
  }, [activeLiquidity, feeAmount, token0, token1])
}

function calculateTokensLocked({
  token0,
  token1,
  tickSpacing,
  currentTick,
  amount,
  tick,
}: {
  token0: EvmCurrency
  token1: EvmCurrency
  tickSpacing: number
  currentTick: number
  amount: bigint
  tick: { tick: number; liquidityNet: bigint }
}): { amount0Locked: number | undefined; amount1Locked: number | undefined } {
  try {
    const tickLower = tick.tick
    const tickUpper = Math.min(TickMath.MAX_TICK, tick.tick + tickSpacing)
    const currSqrtPriceX96 = TickMath.getSqrtRatioAtTick(currentTick)

    const amount0BigInt = getAmount0({
      tickLower,
      tickUpper,
      currentTick,
      liquidity: amount,
      currSqrtPriceX96,
    })
    const amount1BigInt = getAmount1({
      tickLower,
      tickUpper,
      currentTick,
      liquidity: amount,
      currSqrtPriceX96,
    })

    const amount0Locked = Number.parseFloat(
      new Amount(token0, amount0BigInt.toString()).toString(),
    )
    const amount1Locked = Number.parseFloat(
      new Amount(token1, amount1BigInt.toString()).toString(),
    )

    return { amount0Locked, amount1Locked }
  } catch (error) {
    console.error('Error calculating tokens locked:', error)
    return { amount0Locked: undefined, amount1Locked: undefined }
  }
}

type GetAmountParams = {
  tickLower: number
  tickUpper: number
  currentTick: number
  liquidity: bigint
  currSqrtPriceX96: bigint
}

/**
 * Calculates the amount of token0 locked in a liquidity position defined by tick boundaries.
 *
 * Uses SushiSwap v3 math via SqrtPriceMath.getAmount0Delta to compute token amounts based
 * on the position's tick range relative to the current tick. The calculation depends on
 * whether the current price is below, within, or above the position's range.
 *
 * IMPORTANT: The liquidity parameter must be the anchored active liquidity from the three-step
 * anchoring process (see useLiquidityBarData). Using unanchored values from computeSurroundingTicks
 * will produce incorrect amounts.
 *
 * Example:
 * - tickLower = 100, tickUpper = 110, currTick = 105
 * - liquidity = 50000 (anchored via offset calculation)
 * - Since currTick (105) is between tickLower and tickUpper:
 *   amount0 = liquidity * (sqrtPriceUpper - currSqrtPrice) / (sqrtPriceUpper * currSqrtPrice)
 *
 * @param params.tickLower - Lower tick boundary of the position
 * @param params.tickUpper - Upper tick boundary of the position
 * @param params.currentTick - Current pool tick
 * @param params.liquidity - Anchored active liquidity at the tick boundary
 * @param params.currSqrtPriceX96 - Current pool sqrt price in Q96 format
 * @returns Token0 amount in raw units (convert via CurrencyAmount.fromRawAmount)
 */
export function getAmount0({
  tickLower,
  tickUpper,
  currentTick,
  liquidity,
  currSqrtPriceX96,
}: GetAmountParams): bigint {
  const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower)
  const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper)

  let amount0 = 0n
  const roundUp = liquidity > 0n

  if (currentTick <= tickLower) {
    amount0 = SqrtPriceMath.getAmount0Delta(
      sqrtRatioAX96,
      sqrtRatioBX96,
      liquidity,
      roundUp,
    )
  } else if (currentTick < tickUpper) {
    amount0 = SqrtPriceMath.getAmount0Delta(
      currSqrtPriceX96,
      sqrtRatioBX96,
      liquidity,
      roundUp,
    )
  }
  return amount0
}

/**
 * Calculates the amount of token1 locked in a liquidity position defined by tick boundaries.
 *
 * Uses SushiSwap v3 math via SqrtPriceMath.getAmount1Delta to compute token amounts based
 * on the position's tick range relative to the current tick. The calculation has four branches
 * depending on whether the current price is below, at, within, or above the position's range.
 *
 * IMPORTANT: The liquidity parameter must be the anchored active liquidity from the three-step
 * anchoring process (see useLiquidityBarData). Using unanchored values from computeSurroundingTicks
 * will produce incorrect amounts.
 *
 * Example:
 * - tickLower = 100, tickUpper = 110, currTick = 105
 * - liquidity = 50000 (anchored via offset calculation)
 * - Since currTick (105) is between tickLower and tickUpper:
 *   amount1 = liquidity * (currSqrtPrice - sqrtPriceLower) / (sqrtPriceLower * currSqrtPrice)
 *
 * @param params.tickLower - Lower tick boundary of the position
 * @param params.tickUpper - Upper tick boundary of the position
 * @param params.currentTick - Current pool tick
 * @param params.liquidity - Anchored active liquidity at the tick boundary
 * @param params.currSqrtPriceX96 - Current pool sqrt price in Q96 format
 * @returns Token1 amount in raw units (convert via CurrencyAmount.fromRawAmount)
 */
export function getAmount1({
  tickLower,
  tickUpper,
  currentTick,
  liquidity,
  currSqrtPriceX96,
}: GetAmountParams): bigint {
  const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower)
  const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper)
  let amount1 = 0n
  const roundUp = liquidity > 0n

  if (currentTick < tickLower) {
    amount1 = 0n
  } else if (currentTick === tickLower) {
    amount1 = SqrtPriceMath.getAmount1Delta(
      sqrtRatioAX96,
      sqrtRatioBX96,
      liquidity,
      roundUp,
    )
  } else if (currentTick < tickUpper) {
    amount1 = SqrtPriceMath.getAmount1Delta(
      sqrtRatioAX96,
      currSqrtPriceX96,
      liquidity,
      roundUp,
    )
  } else {
    amount1 = SqrtPriceMath.getAmount1Delta(
      sqrtRatioAX96,
      sqrtRatioBX96,
      liquidity,
      roundUp,
    )
  }
  return amount1
}
