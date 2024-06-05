import type { PoolId } from 'sushi/types'

export type PoolIfIncentivized<T extends PoolId = PoolId> = T & {
  isIncentivized: boolean
  wasIncentivized: boolean
}
