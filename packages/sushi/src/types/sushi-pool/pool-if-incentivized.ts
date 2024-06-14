import type { PoolId } from 'sushi/types'

type PoolIfIncentivizedRequired = {
  isIncentivized: boolean
  wasIncentivized: boolean
}

type PoolIfIncentivizedOptional =
  | PoolIfIncentivizedRequired
  | {
      isIncentivized?: undefined
      wasIncentivized?: undefined
    }

export type PoolIfIncentivized<
  T extends PoolId = PoolId,
  Optional extends boolean = false,
> = T &
  (Optional extends true
    ? PoolIfIncentivizedOptional
    : PoolIfIncentivizedRequired)
