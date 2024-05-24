import type { ChainId } from 'sushi/chain'

export type ChainIdVariable<T extends ChainId> = { chainId: T }

export type ChainIdsVariable<T extends ChainId> = { chainIds?: T[] }

export type ChainIdsInsteadOfChainId<T extends ChainIdVariable<ChainId>> = Omit<
  T,
  'chainId'
> &
  ChainIdsVariable<T['chainId']>
