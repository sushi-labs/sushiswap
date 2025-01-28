import type { EvmChainId } from 'sushi'
import { PriceWorkerReceiveMessageChainState } from '../price-worker/types'

export interface ProviderChainState {
  chainId: EvmChainId

  priceMap?: Map<bigint, number>

  lastModified: number

  isLoading: boolean
  isUpdating: boolean
  isError: boolean
}

export interface ProviderState {
  chains: Map<EvmChainId, ProviderChainState>
  ready: boolean
}

export interface ProviderMutations {
  incrementChainId: (chainId: EvmChainId) => void
  decrementChainId: (chainId: EvmChainId) => void
}

export interface Provider {
  state: ProviderState
  mutate: ProviderMutations
}

export type ProviderActions = {
  type: 'UPDATE_CHAIN_STATE'
  payload: PriceWorkerReceiveMessageChainState['payload']
}
