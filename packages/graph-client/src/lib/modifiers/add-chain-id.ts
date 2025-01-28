import type { ChainId } from 'sushi/chain'
import type { ChainIdVariable } from '../types/chainId.js'

type ReturnType<C extends ChainId, T extends Record<string, any>> = T &
  ChainIdVariable<C>

export function addChainId<
  C extends ChainId,
  T extends Record<string, any> & { chainId?: never },
>(chainId: C, object: T): ReturnType<C, T> {
  Object.defineProperty(object, 'chainId', {
    value: chainId,
    enumerable: true,
  })
  return object as ReturnType<C, T>
}
