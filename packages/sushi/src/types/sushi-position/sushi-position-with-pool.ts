import type { PoolBase } from 'sushi/types'
import { SushiPositionBase } from './sushi-position-base'

export type SushiPositionWithPool<
  Pool extends PoolBase = PoolBase,
  Position extends SushiPositionBase = SushiPositionBase,
> = Omit<Position, 'pool'> & {
  pool: Pool
}
