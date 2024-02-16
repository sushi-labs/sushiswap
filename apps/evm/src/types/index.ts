import { SushiSwapV2ChainId, TridentChainId } from 'sushi'
import { SushiSwapV3ChainId } from 'sushi'

export type SwapChainId =
  | TridentChainId
  | SushiSwapV2ChainId
  | SushiSwapV3ChainId

import { Pool } from '@sushiswap/client'
import { UserPosition } from '@sushiswap/graph-client'

export interface PositionWithPool extends Omit<UserPosition, 'pool'> {
  pool: Pool
}
