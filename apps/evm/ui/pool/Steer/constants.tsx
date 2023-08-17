import { Pool } from '@sushiswap/client'
import { SteerStrategy } from '@sushiswap/database'
import { FC } from 'react'

import {
  SteerClassicRebalanceStrategy,
  SteerDeltaNeutralStablesStrategy,
  SteerElasticExpansionStrategy,
  SteerHighLowChannelStrategy,
  SteerMovingVolatilityChannelMediumStrategy,
  SteerStaticStableStrategy,
} from './Strategies'

export type SteerStrategyComponent = FC<{
  pool: Pool
  vault: Pool['steerVaults'][0]
}>

interface SteerStrategyConfig {
  name: string
  description: string
  component: SteerStrategyComponent
}

export const SteerStrategyConfig: Record<SteerStrategy, SteerStrategyConfig> = {
  [SteerStrategy.ClassicRebalance]: {
    name: 'Classic Rebalance Pool',
    description: 'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
    component: SteerClassicRebalanceStrategy,
  },
  [SteerStrategy.DeltaNeutralStables]: {
    name: 'Delta Neutral Pool',
    description: 'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
    component: SteerDeltaNeutralStablesStrategy,
  },
  [SteerStrategy.ElasticExpansion]: {
    name: 'Elastic Expansion Pool',
    description: 'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
    component: SteerElasticExpansionStrategy,
  },
  [SteerStrategy.HighLowChannel]: {
    name: 'High Low Channel Pool',
    description: 'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
    component: SteerHighLowChannelStrategy,
  },
  [SteerStrategy.MovingVolatilityChannelMedium]: {
    name: 'Moving Volatility Pool',
    description: 'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
    component: SteerMovingVolatilityChannelMediumStrategy,
  },
  [SteerStrategy.StaticStable]: {
    name: 'Stable Pool',
    description: 'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
    component: SteerStaticStableStrategy,
  },
}
