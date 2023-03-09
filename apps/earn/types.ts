import { UserPosition } from '@sushiswap/graph-client'
import { Pool } from '@sushiswap/client'

export interface PositionWithPool extends Omit<UserPosition, 'pool'> {
  pool: Pool
}
