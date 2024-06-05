import type { SushiPoolBase } from 'sushi/types'

export type MaybeNestedPool<T extends SushiPoolBase> =
  | T
  | {
      pool: T
    }

export function unnestPool<T extends SushiPoolBase>(
  maybeNestedPool: MaybeNestedPool<T>,
) {
  return 'pool' in maybeNestedPool ? maybeNestedPool.pool : maybeNestedPool
}
