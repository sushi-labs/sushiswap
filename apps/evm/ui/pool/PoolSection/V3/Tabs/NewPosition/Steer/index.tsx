import { SteerStrategy } from '@sushiswap/database'
import React from 'react'

export const SteerStrategies = {
  [SteerStrategy.ClassicRebalance]: <></>,
  [SteerStrategy.DeltaNeutralStables]: <></>,
  [SteerStrategy.ElasticExpansion]: <></>,
  [SteerStrategy.HighLowChannel]: <></>,
  [SteerStrategy.MovingVolatilityChannelMedium]: <></>,
  [SteerStrategy.StaticStable]: <></>,
} as const satisfies Record<SteerStrategy, unknown>
