import { ConstantProductPoolFactoryChainId, StablePoolFactoryChainId } from '@sushiswap/trident-core'
import { SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'

export type SwapChainId =
  | StablePoolFactoryChainId
  | ConstantProductPoolFactoryChainId
  | SushiSwapV2ChainId
  | SushiSwapV3ChainId

import { Pool } from '@sushiswap/client'
import { UserPosition } from '@sushiswap/graph-client'

export interface PositionWithPool extends Omit<UserPosition, 'pool'> {
  pool: Pool
}
