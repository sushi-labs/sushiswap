import type { ChainId } from 'sushi'
import { ReadOnlyPriceBufferWrapper } from './price-data-wrapper'

export interface ProviderChainState {
  chainId: ChainId
  active: boolean

  priceData?: ReadOnlyPriceBufferWrapper

  lastModified: number

  isLoading: boolean
  isUpdating: boolean
  isError: boolean
}

export interface ProviderState {
  chains: Map<ChainId, ProviderChainState>
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
