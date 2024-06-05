import type { PoolId } from 'sushi/types'
import { SushiPositionBase } from './sushi-position-base'

export type SushiPositionWithPool<
  Pool extends PoolId = PoolId,
  Position extends SushiPositionBase = SushiPositionBase,
> = Omit<Position, 'pool'> & {
  pool: Pool
}
