import { SteerVault } from '@sushiswap/client'
import { SteerStrategy } from '@sushiswap/client'
import { FC } from 'react'

import { SteerBaseStrategy } from './SteerBaseStrategy'

export interface SteerStrategyGeneric {
  tokenRatios: {
    token0: number
    token1: number
  }
  priceExtremes: {
    min: string
    max: string
  }
  adjustment: {
    next: string
    frequency: string
  }
  positions: {
    lowerTick: bigint
    upperTick: bigint
    relativeWeight: bigint
  }[]
}

export type SteerStrategyComponent = FC<{
  vault: SteerVault
  generic: SteerStrategyGeneric
}>

export const SteerStrategyComponents: Record<
  SteerStrategy,
  SteerStrategyComponent
> = {
  [SteerStrategy.ClassicRebalance]: SteerBaseStrategy,
  [SteerStrategy.DeltaNeutralStables]: SteerBaseStrategy,
  [SteerStrategy.ElasticExpansion]: SteerBaseStrategy,
  [SteerStrategy.HighLowChannel]: SteerBaseStrategy,
  [SteerStrategy.MovingVolatilityChannelMedium]: SteerBaseStrategy,
  [SteerStrategy.StaticStable]: SteerBaseStrategy,
  [SteerStrategy.BollingerAlgo]: SteerBaseStrategy,
  [SteerStrategy.ChannelMultiplier]: SteerBaseStrategy,
  [SteerStrategy.FixedPercentage]: SteerBaseStrategy,
  [SteerStrategy.PriceMultiplier]: SteerBaseStrategy,
  [SteerStrategy.KeltnerAlgo]: SteerBaseStrategy,
  [SteerStrategy.MovingVolatilityChannel]: SteerBaseStrategy,
}
