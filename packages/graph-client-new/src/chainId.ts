import type { ChainId } from 'sushi/chain'

export type ChainIdVariable<T extends ChainId> = { chainId: T }

export type ChainIdsVariable<T extends ChainId> = { chainIds?: T[] }
