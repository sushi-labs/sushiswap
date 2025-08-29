import type { ChainId } from 'sushi'

export type ChainIdVariable<T extends ChainId> = { chainId: Readonly<T> }

export type ChainIdsVariable<T extends ChainId> = { chainIds?: Readonly<T[]> }

export type ChainIdsInsteadOfChainId<T extends ChainIdVariable<ChainId>> = Omit<
  T,
  'chainId'
> &
  ChainIdsVariable<T['chainId']>
