import { SteerStrategy } from '@sushiswap/database'

export const SteerStrategyName: Record<SteerStrategy, string> = {
  [SteerStrategy.ClassicRebalance]: 'Classic Rebalance Pool',
  [SteerStrategy.DeltaNeutralStables]: 'Delta Neutral Pool',
  [SteerStrategy.ElasticExpansion]: 'Elastic Expansion Pool',
  [SteerStrategy.HighLowChannel]: 'High Low Channel Pool',
  [SteerStrategy.MovingVolatilityChannelMedium]: 'Moving Volatility Pool',
  [SteerStrategy.StaticStable]: 'Stable Pool',
}

export const SteerStrategyDescription: Record<SteerStrategy, string> = {
  [SteerStrategy.ClassicRebalance]:
    'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
  [SteerStrategy.DeltaNeutralStables]:
    'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
  [SteerStrategy.ElasticExpansion]:
    'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
  [SteerStrategy.HighLowChannel]: 'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
  [SteerStrategy.MovingVolatilityChannelMedium]:
    'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
  [SteerStrategy.StaticStable]: 'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
}
