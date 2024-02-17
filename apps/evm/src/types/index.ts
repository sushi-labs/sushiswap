import { SushiSwapV2ChainId, TridentChainId, SushiSwapV3ChainId } from 'sushi/config'

export type SwapChainId =
  | TridentChainId
  | SushiSwapV2ChainId
  | SushiSwapV3ChainId

import { Pool } from '@sushiswap/client'
import { UserPosition } from '@sushiswap/graph-client'

export interface PositionWithPool extends Omit<UserPosition, 'pool'> {
  pool: Pool
}
