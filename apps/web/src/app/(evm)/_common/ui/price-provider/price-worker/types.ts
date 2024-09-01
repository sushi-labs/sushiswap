import type { ChainId } from 'sushi'
import { PriceBufferWrapper } from '../price-data-wrapper'

export enum PriceWorkerPostMessageType {
  Initialize = 'Initialize',
  EnableChainId = 'EnableChainId',
  DisableChainId = 'DisableChainId',
  RefetchChainId = 'RefetchChainId',
}

type Initialize = {
  type: PriceWorkerPostMessageType.Initialize
  canUseSharedArrayBuffer: boolean
}

type EnableChainId = {
  chainId: ChainId
  type: PriceWorkerPostMessageType.EnableChainId
}

type DisableChainId = {
  chainId: ChainId
  type: PriceWorkerPostMessageType.DisableChainId
}

type RefetchChainId = {
  chainId: ChainId
  type: PriceWorkerPostMessageType.RefetchChainId
}

export type PriceWorkerPostMessage =
  | Initialize
  | EnableChainId
  | DisableChainId
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
  active: boolean

  priceData: PriceBufferWrapper

  wasFetched: boolean
  lastModified: number

  isLoading: boolean
  isUpdating: boolean
  isError: boolean
}
