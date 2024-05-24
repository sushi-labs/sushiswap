import type { ChainId } from 'sushi/chain'

type ReturnType<T extends { chainId: ChainId }> = T & {
  id: `${T['chainId']}:${string}`
}

export function convertIdToMultichainId<
  T extends { id: string; chainId: ChainId },
>(object: T): ReturnType<T> {
  object.id = `${object.chainId}:${object.id}`
  return object as ReturnType<T>
}
