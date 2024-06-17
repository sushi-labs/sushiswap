import type { PoolId } from 'sushi/types'

export type PoolSwapFee<T extends PoolId = PoolId> = T & {
  swapFee: number
}
