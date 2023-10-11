import { SteerVault } from '@sushiswap/client/src/pure/steer-vault/vault'
import { SteerStrategy } from '@sushiswap/database'
import { FC } from 'react'

import { SteerClassicRebalanceStrategy } from './SteerClassicRebalanceStrategy'
import { SteerDeltaNeutralStablesStrategy } from './SteerDeltaNeutralStablesStrategy'
import { SteerElasticExpansionStrategy } from './SteerElasticExpansionStrategy'
import { SteerHighLowChannelStrategy } from './SteerHighLowChannelStrategy'
import { SteerMovingVolatilityChannelMediumStrategy } from './SteerMovingVolatilityChannelMediumStrategy'
import { SteerStaticStableStrategy } from './SteerStaticStableStrategy'

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
  [SteerStrategy.ClassicRebalance]: SteerClassicRebalanceStrategy,
  [SteerStrategy.DeltaNeutralStables]: SteerDeltaNeutralStablesStrategy,
  [SteerStrategy.ElasticExpansion]: SteerElasticExpansionStrategy,
  [SteerStrategy.HighLowChannel]: SteerHighLowChannelStrategy,
  [SteerStrategy.MovingVolatilityChannelMedium]:
    SteerMovingVolatilityChannelMediumStrategy,
  [SteerStrategy.StaticStable]: SteerStaticStableStrategy,
}
