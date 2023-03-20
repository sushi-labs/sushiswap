import { ChainId } from '@sushiswap/chain'
import { PrismaClient } from '@sushiswap/database'
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

// export abstract class ProtocolBase {
//    static run(config: SeedConfiguration): Promise<NewestPool | undefined>
//   static logPrefix(config: SeedConfiguration): string
// }
