import { SteerStrategy } from '@sushiswap/database'
import { FC } from 'react'

import { SteerVault, SteerVaultWithPool } from '@sushiswap/steer-sdk'
import type { PoolBase, PoolWithFeeAprs, PoolWithIncentives } from 'sushi/types'
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
  vault: SteerVaultWithPool<
    SteerVault,
    PoolWithIncentives<PoolWithFeeAprs<PoolBase>>
  >
  generic: SteerStrategyGeneric
}>

export const SteerStrategyComponents: Record<
  SteerStrategy,
  SteerStrategyComponent
> = {
  [SteerStrategy.SuperWide]: SteerBaseStrategy,
  [SteerStrategy.ClassicRebalance]: SteerBaseStrategy,
  [SteerStrategy.DeltaNeutralStables]: SteerBaseStrategy,
  [SteerStrategy.StableExpansion]: SteerBaseStrategy,
  [SteerStrategy.ElasticExpansion]: SteerBaseStrategy,
  [SteerStrategy.HighLowChannel]: SteerBaseStrategy,
  [SteerStrategy.StaticStable]: SteerBaseStrategy,
  [SteerStrategy.BollingerAlgo]: SteerBaseStrategy,
  [SteerStrategy.ChannelMultiplier]: SteerBaseStrategy,
  [SteerStrategy.FixedPercentage]: SteerBaseStrategy,
  [SteerStrategy.PriceMultiplier]: SteerBaseStrategy,
  [SteerStrategy.KeltnerAlgo]: SteerBaseStrategy,
  [SteerStrategy.MovingVolatilityChannel]: SteerBaseStrategy,
  [SteerStrategy.MovingVolatilityChannelMedium]: SteerBaseStrategy,
}
