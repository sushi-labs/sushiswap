import type { ChainId } from 'sushi'
import { PriceBufferWrapper } from '../price-data-wrapper/price-buffer-wrapper'

export enum PriceWorkerPostMessageType {
  Initialize = 'Initialize',
  IncrementChainId = 'IncrementChainId',
  DecrementChainId = 'DecrementChainId',
  RefetchChainId = 'RefetchChainId',
}

type Initialize = {
  type: PriceWorkerPostMessageType.Initialize
  canUseSharedArrayBuffer: boolean
}

type IncrementChainId = {
  chainId: ChainId
  type: PriceWorkerPostMessageType.IncrementChainId
}

type DecrementChainId = {
  chainId: ChainId
  type: PriceWorkerPostMessageType.DecrementChainId
}

type RefetchChainId = {
  chainId: ChainId
  type: PriceWorkerPostMessageType.RefetchChainId
}

export type PriceWorkerPostMessage =
  | Initialize
  | IncrementChainId
  | DecrementChainId
  | RefetchChainId

export enum PriceWorkerReceiveMessageType {
  ChainState = 'ChainState',
  ChainPriceData = 'ChainPriceData',
}

export type PriceWorkerReceiveMessageChainState = {
  type: PriceWorkerReceiveMessageType.ChainState
  payload: Partial<Omit<WorkerChainState, 'priceData' | 'listenerCount'>> & {
    chainId: ChainId
  } & {
    prices?: {
      priceData: SharedArrayBuffer | Buffer
      priceCount: number
    }
  }
}

export type PriceWorkerReceiveMessage = PriceWorkerReceiveMessageChainState

export type PriceWorker = (typeof Worker)['prototype'] & {
  postMessage(message: PriceWorkerPostMessage | PriceWorkerPostMessage[]): void
}

export interface WorkerChainState {
  chainId: ChainId
  listenerCount: number

  priceData: PriceBufferWrapper

  lastModified: number

  isLoading: boolean
  isUpdating: boolean
  isError: boolean
}
