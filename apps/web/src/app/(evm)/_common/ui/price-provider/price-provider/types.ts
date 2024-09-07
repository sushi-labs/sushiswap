import type { ChainId } from 'sushi'
import { ReadOnlyPriceBufferWrapper } from '../price-data-wrapper/price-buffer-wrapper'
import { PriceWorkerReceiveMessageChainState } from '../price-worker/types'

export interface ProviderChainState {
  chainId: ChainId

  priceData?: ReadOnlyPriceBufferWrapper

  lastModified: number

  isLoading: boolean
  isUpdating: boolean
  isError: boolean
}

export interface ProviderState {
  chains: Map<ChainId, ProviderChainState>
  ready: boolean
}

export interface ProviderMutations {
  incrementChainId: (chainId: ChainId) => void
  decrementChainId: (chainId: ChainId) => void
}

export interface Provider {
  state: ProviderState
  mutate: ProviderMutations
}

export type ProviderActions =
  | {
      type: 'UPDATE_CHAIN_STATE'
      payload: PriceWorkerReceiveMessageChainState['payload']
    }
  | {
      type: 'SET_READY'
      payload: {
        ready: boolean
      }
    }
