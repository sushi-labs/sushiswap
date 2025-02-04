import type { FC } from 'react'

import type { V3Pool, VaultV1 } from '@sushiswap/graph-client/data-api'

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
  pool: V3Pool
  vault: VaultV1
  generic: SteerStrategyGeneric
}>
