import { SteerStrategy } from '@sushiswap/database'

interface SteerStrategyConfig {
  name: string
  description: string
}

export const SteerStrategyConfig: Record<SteerStrategy, SteerStrategyConfig> = {
  [SteerStrategy.ClassicRebalance]: {
    name: 'Classic Rebalance Pool',
    description: 'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
  },
  [SteerStrategy.DeltaNeutralStables]: {
    name: 'Delta Neutral Pool',
    description: 'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
  },
  [SteerStrategy.ElasticExpansion]: {
    name: 'Elastic Expansion Pool',
    description: 'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
  },
  [SteerStrategy.HighLowChannel]: {
    name: 'High Low Channel Pool',
    description: 'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
  },
  [SteerStrategy.MovingVolatilityChannelMedium]: {
    name: 'Moving Volatility Pool',
    description: 'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
  },
  [SteerStrategy.StaticStable]: {
    name: 'Stable Pool',
    description: 'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
  },
}
