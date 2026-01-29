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
import {
  calculatePriceFromTick,
  calculateTickFromPrice,
} from '~stellar/_common/lib/soroban'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { MAX_TICK_RANGE, alignTick } from '~stellar/_common/lib/utils/ticks'
import { LiquidityChartRangeInput } from '../LiquidityChartRangeInput'

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
              [Bound.LOWER]: calculatePriceFromTick(tickLower),
              [Bound.UPPER]: calculatePriceFromTick(tickUpper),
            }}
            onLeftRangeInput={(typedValue) => {
              setIsDynamic(false)
              setTickLower(
                alignTick(
                  calculateTickFromPrice(Number.parseFloat(typedValue)),
                  tickSpacing,
                ),
              )
            }}
            onRightRangeInput={(typedValue) => {
              setIsDynamic(false)
              setTickUpper(
                alignTick(
                  calculateTickFromPrice(Number.parseFloat(typedValue)),
                  tickSpacing,
                ),
              )
            }}
            interactive={true}
            hideBrushes={false}
          />
        )}
      </CardContent>
    </Card>
  )
}
