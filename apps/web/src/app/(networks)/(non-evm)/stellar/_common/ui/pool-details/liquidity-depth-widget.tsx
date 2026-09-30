'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SkeletonBox,
} from '@sushiswap/ui'
import React, { type FC } from 'react'
import { Bound } from 'src/lib/constants'
import type { TickRangeSelectorState } from '~stellar/_common/lib/hooks/tick/use-tick-range-selector'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import {
  parseStartingPrice,
  poolPrice,
} from '~stellar/_common/lib/utils/liquidity-amounts'
import {
  MAX_TICK_RANGE,
  alignTick,
  getSqrtRatioAtTick,
  getTickAtSqrtRatio,
} from '~stellar/_common/lib/utils/ticks'
import { LiquidityChartRangeInput } from '../liquidity-chart-range-input'

interface LiquidityDepthWidgetProps {
  pool: PoolInfo | null | undefined
  tickRangeSelectorState: TickRangeSelectorState
}

/**
 * Widget to display liquidity depth/density chart for a Stellar pool
 *
 * This shows the distribution of liquidity across price ranges,
 * helping LPs understand where liquidity is concentrated.
 *
 */
export const LiquidityDepthWidget: FC<LiquidityDepthWidgetProps> = ({
  pool,
  tickRangeSelectorState,
}) => {
  const {
    tickLower,
    tickUpper,
    tickSpacing,
    setTickLower,
    setTickUpper,
    setIsDynamic,
  } = tickRangeSelectorState

  function setPrice(value: string, bound: Bound): void {
    if (!pool) return
    const price = parseStartingPrice(pool.token0, pool.token1, value)
    if (price === undefined) return
    setIsDynamic(false)
    const setTick = bound === Bound.LOWER ? setTickLower : setTickUpper
    setTick(alignTick(getTickAtSqrtRatio(price), tickSpacing))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Liquidity Distribution</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!pool ? (
          <SkeletonBox className="w-full h-[300px]" />
        ) : (
          <LiquidityChartRangeInput
            pool={pool}
            ticksAtLimit={{
              [Bound.LOWER]:
                tickLower <= alignTick(MAX_TICK_RANGE.lower, tickSpacing),
              [Bound.UPPER]:
                tickUpper >= alignTick(MAX_TICK_RANGE.upper, tickSpacing),
            }}
            priceRange={{
              [Bound.LOWER]: poolPrice(
                pool.token0,
                pool.token1,
                getSqrtRatioAtTick(tickLower),
              ).toNumber(),
              [Bound.UPPER]: poolPrice(
                pool.token0,
                pool.token1,
                getSqrtRatioAtTick(tickUpper),
              ).toNumber(),
            }}
            onLeftRangeInput={(value) => setPrice(value, Bound.LOWER)}
            onRightRangeInput={(value) => setPrice(value, Bound.UPPER)}
            interactive={true}
            hideBrushes={false}
          />
        )}
      </CardContent>
    </Card>
  )
}
