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

type ChainState = {
  type: PriceWorkerReceiveMessageType.ChainState
  chainState: Omit<WorkerChainState, 'priceData' | 'wasFetched'>
}

type ChainPriceData = {
  type: PriceWorkerReceiveMessageType.ChainPriceData
  chainId: ChainId
  priceBuffer: ArrayBuffer | SharedArrayBuffer
  priceCount: number
}

export type PriceWorkerReceiveMessage = ChainState | ChainPriceData

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
