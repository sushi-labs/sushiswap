import { SteerStrategy } from '@sushiswap/database'

interface SteerStrategyConfig {
  name: string
  description: string
}

export const SteerStrategyConfig: Record<SteerStrategy, SteerStrategyConfig> = {
  [SteerStrategy.ClassicRebalance]: {
    name: 'Classic Rebalance Pool',
    description:
      'This strategy makes a position of a fixed size centered around the current price. This position is maintained until the current price leaves the position range. The position then rebalances and makes a new position centered around the new current price. Factoring in the current price allows for reduced gas costs, only executing when the position is out of range.',
  },
  [SteerStrategy.DeltaNeutralStables]: {
    name: 'Delta Neutral Pool',
    description: 'Uses Simple Moving Average and a predefined multiplier to construct a price range.',
  },
  [SteerStrategy.ElasticExpansion]: {
    name: 'Elastic Expansion Pool',
    description:
      'This strategy uses a technique called Bollinger bands to create a flexible pool of funds for liquidity provision. It automatically adjusts to changes in market conditions, such as price swings and fluctuations, to optimize the placement of funds, fees earned, and capital efficiency.',
  },
  [SteerStrategy.HighLowChannel]: {
    name: 'High Low Channel Pool',
    description:
      'The Donchian Channel is a technical indicator used to measure the highest high and lowest low over a specified period, and it creates an upper and lower band accordingly. The range multiplier is also used to adjust the bands based on market volatility.',
  },
  [SteerStrategy.MovingVolatilityChannelMedium]: {
    name: 'Moving Volatility Pool',
    description:
      'This strategy uses recent trading data to form a Keltner Channel that sets the range to place optimal liquidity for a given period of time. The Keltner Channel is a technical indicator that measures volatility using upper and lower bands, and an exponential moving average. These bands adjust based on market volatility and can help identify trends useful for providing liquidity. The Keltner Channel is a useful tool for LPs seeking to make informed decisions based on market volatility.',
  },
  [SteerStrategy.StaticStable]: {
    name: 'Stable Pool',
    description:
      "This strategy is set based on the token's decimal precision and the typical offset and variance from the ideal peg. These positions are static, meaning low gas fees and reduced price volatility.",
  },
}
