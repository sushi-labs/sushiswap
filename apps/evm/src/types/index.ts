import {
  SushiSwapV2ChainId,
  SushiSwapV3ChainId,
  TridentChainId,
} from 'sushi/config'

export type SwapChainId =
  | TridentChainId
  | SushiSwapV2ChainId
  | SushiSwapV3ChainId

import { Pool } from '@sushiswap/client'
import { CombinedV2UserPosition } from '@sushiswap/graph-client-new/composite/combined-user-positions'

export interface PositionWithPool extends Omit<CombinedV2UserPosition, 'pool'> {
  pool: Pool
}
