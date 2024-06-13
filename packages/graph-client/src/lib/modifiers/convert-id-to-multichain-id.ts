import type { ChainId } from 'sushi/chain'
import type { ID } from 'sushi/types'

type ReturnType<T extends { chainId: ChainId }> = Omit<T, 'id'> & {
  id: ID
}

export function convertIdToMultichainId<
  T extends { id: string; chainId: ChainId },
>(object: T): ReturnType<T> {
  object.id = `${object.chainId}:${object.id}`
  return object as ReturnType<T>
}
