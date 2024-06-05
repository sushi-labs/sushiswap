import type { SushiPositionBase } from 'sushi/types'

export type SushiPositionStaked<
  T extends SushiPositionBase = SushiPositionBase,
> = T & {
  stakedBalance: bigint
}
