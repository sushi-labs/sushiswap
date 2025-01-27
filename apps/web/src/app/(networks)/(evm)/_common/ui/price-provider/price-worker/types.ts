import type { EvmChainId } from 'sushi'

export enum PriceWorkerPostMessageType {
  Initialize = 'Initialize',
  IncrementChainId = 'IncrementChainId',
  DecrementChainId = 'DecrementChainId',
  RefetchChainId = 'RefetchChainId',
  SetEnabled = 'SetEnabled',
}

type Initialize = {
  type: PriceWorkerPostMessageType.Initialize
  canUseSharedArrayBuffer: boolean
}

type IncrementChainId = {
  chainId: EvmChainId
  type: PriceWorkerPostMessageType.IncrementChainId
}

type DecrementChainId = {
  chainId: EvmChainId
  type: PriceWorkerPostMessageType.DecrementChainId
}

type RefetchChainId = {
  chainId: EvmChainId
  type: PriceWorkerPostMessageType.RefetchChainId
}

type SetEnabled = {
  enabled: boolean
  type: PriceWorkerPostMessageType.SetEnabled
}

export type PriceWorkerPostMessage =
  | Initialize
  | IncrementChainId
  | DecrementChainId
  | RefetchChainId
  | SetEnabled

export enum PriceWorkerReceiveMessageType {
  ChainState = 'ChainState',
}

export type PriceWorkerReceiveMessageChainState = {
  type: PriceWorkerReceiveMessageType.ChainState
  payload: Partial<Omit<WorkerChainState, 'priceObject' | 'listenerCount'>> & {
    chainId: EvmChainId
  }
}

export type PriceWorkerReceiveMessage = PriceWorkerReceiveMessageChainState

export type PriceWorker = (typeof Worker)['prototype'] & {
  postMessage(message: PriceWorkerPostMessage | PriceWorkerPostMessage[]): void
}

export interface WorkerChainState {
  chainId: EvmChainId
  listenerCount: number

  priceMap: Map<bigint, number>

  lastModified: number

  isLoading: boolean
  isUpdating: boolean
  isError: boolean
}
