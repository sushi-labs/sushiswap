import type { SushiPoolBase } from 'sushi/types'
import { SushiPositionBase } from './sushi-position-base'

export type SushiPositionWithPool<
  Pool extends SushiPoolBase = SushiPoolBase,
  Position extends SushiPositionBase = SushiPositionBase,
> = Omit<Position, 'pool'> & {
  pool: Pool
}
