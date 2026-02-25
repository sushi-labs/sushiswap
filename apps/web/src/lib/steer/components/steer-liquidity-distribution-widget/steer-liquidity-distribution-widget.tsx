import type { VaultV1 } from '@sushiswap/graph-client/data-api'
import { CardTitle } from '@sushiswap/ui'
import React, { type FC } from 'react'
import { SteerLiquidityInRangeChip } from './steer-liquidity-in-range-chip'
import { SteerTokenDistributionBar } from './steer-token-distribution-bar'

interface SteerLiquidityDistributionWidgetProps {
  vault: VaultV1
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
