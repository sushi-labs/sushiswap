import { Pool } from '@sushiswap/client'
import { CardTitle } from '@sushiswap/ui'
import React, { FC } from 'react'

import { SteerLiquidityInRangeChip } from './SteerLiquidityInRangeChip'
import { SteerTokenDistributionBar } from './SteerTokenDistributionBar'

interface SteerLiquidityDistributionWidgetProps {
  vault: Pool['steerVaults'][0]
}

export const SteerLiquidityDistributionWidget: FC<
  SteerLiquidityDistributionWidgetProps
> = ({ vault }) => {
  return (
    <>
      <div className="flex justify-between">
        <CardTitle>Liquidity Distribution</CardTitle>

        <SteerLiquidityInRangeChip vault={vault} />
      </div>
      <SteerTokenDistributionBar vault={vault} />
    </>
  )
}
