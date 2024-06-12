import { ChainId } from '../../chain/index.js'

const MAX_FIRST_PARTIAL: Partial<Record<ChainId, number>> = {
  [ChainId.METIS]: 100,
}

export const MAX_FIRST = new Proxy(MAX_FIRST_PARTIAL, {
  get: (target, name: any) => {
    return name in target ? target[name as ChainId] : 1000
  },
}) as Record<ChainId, number>
