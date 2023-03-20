import { ChainId } from '@sushiswap/chain'

import { PoolType, ProtocolName, ProtocolVersion } from '../../config.js'

export interface NewestPool {
  address: string
  timestamp: number
}

export interface OptionalPoolConfiguration {
  type: PoolType
  swapFee: number
  twapEnabled: boolean
}

export interface SeedConfiguration {
  chainId: ChainId
  subgraph: string
  graphHost: string
  protocol: ProtocolName
  version: ProtocolVersion
  poolConfiguration?: OptionalPoolConfiguration
  newestPool?: NewestPool
}
