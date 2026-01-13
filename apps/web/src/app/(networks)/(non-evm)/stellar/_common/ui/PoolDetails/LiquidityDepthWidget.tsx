'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SkeletonBox,
} from '@sushiswap/ui'
import React, { type FC } from 'react'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { LiquidityChartRangeInput } from '../LiquidityChartRangeInput'

interface LiquidityDepthWidgetProps {
  pool: PoolInfo | null | undefined
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
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Liquidity Distribution</span>
          <span className="text-xs font-normal text-muted-foreground">
            (Preview)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!pool ? (
          <SkeletonBox className="w-full h-[300px]" />
        ) : (
          <LiquidityChartRangeInput
            pool={pool}
            hideBrushes={true}
            interactive={false}
          />
        )}
      </CardContent>
    </Card>
  )
}
