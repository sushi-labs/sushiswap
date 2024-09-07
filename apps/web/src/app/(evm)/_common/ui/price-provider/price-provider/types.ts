import type { ChainId } from 'sushi'
import { ReadOnlyPriceBufferWrapper } from '../price-data-wrapper/price-buffer-wrapper'

export interface ProviderChainState {
  chainId: ChainId
  listenerCount: number

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
      payload: Omit<ProviderChainState, 'priceData'>
    }
  | {
      type: 'UPDATE_CHAIN_PRICE_DATA'
      payload: {
        chainId: ChainId
        priceBuffer: ArrayBuffer | SharedArrayBuffer
        priceCount: number
      }
    }
  | {
      type: 'SET_READY'
      payload: {
        ready: boolean
      }
    }
