import type { EvmChainId } from 'sushi/evm'
import type { SvmChainId } from 'sushi/svm'

export enum PriceWorkerPostMessageType {
  Initialize = 'Initialize',
  IncrementChainId = 'IncrementChainId',
  DecrementChainId = 'DecrementChainId',
  RefetchChainId = 'RefetchChainId',
  SetEnabled = 'SetEnabled',
}
export type EvmOrSvmChainId = EvmChainId | SvmChainId

type Initialize = {
  type: PriceWorkerPostMessageType.Initialize
  canUseSharedArrayBuffer: boolean
}

type IncrementChainId<TChainId extends EvmChainId | SvmChainId> = {
  chainId: TChainId
  type: PriceWorkerPostMessageType.IncrementChainId
}

type DecrementChainId<TChainId extends EvmChainId | SvmChainId> = {
  chainId: TChainId
  type: PriceWorkerPostMessageType.DecrementChainId
}

type RefetchChainId<TChainId extends EvmChainId | SvmChainId> = {
  chainId: TChainId
  type: PriceWorkerPostMessageType.RefetchChainId
}

type SetEnabled = {
  enabled: boolean
  type: PriceWorkerPostMessageType.SetEnabled
}

export type PriceWorkerPostMessage<TChainId extends EvmChainId | SvmChainId> =
  | Initialize
  | IncrementChainId<TChainId>
  | DecrementChainId<TChainId>
  | RefetchChainId<TChainId>
  | SetEnabled

export enum PriceWorkerReceiveMessageType {
  ChainState = 'ChainState',
}

type PriceMapKey<TChainId extends EvmChainId | SvmChainId> =
  TChainId extends EvmChainId ? bigint : string

export interface WorkerChainState<TChainId extends EvmChainId | SvmChainId> {
  chainId: TChainId
  listenerCount: number

  priceMap: Map<PriceMapKey<TChainId>, number>

  lastModified: number

  isLoading: boolean
  isUpdating: boolean
  isError: boolean
}

export type PriceWorkerReceiveMessageChainState<
  TChainId extends EvmChainId | SvmChainId,
> = {
  type: PriceWorkerReceiveMessageType.ChainState
  payload: Partial<
    Omit<WorkerChainState<TChainId>, 'priceObject' | 'listenerCount'>
  > & {
    chainId: TChainId
  }
}

export type PriceWorkerReceiveMessage<
  TChainId extends EvmChainId | SvmChainId,
> = PriceWorkerReceiveMessageChainState<TChainId>

export type PriceWorker<TChainId extends EvmChainId | SvmChainId> =
  (typeof Worker)['prototype'] & {
    postMessage(
      message:
        | PriceWorkerPostMessage<TChainId>
        | PriceWorkerPostMessage<TChainId>[],
    ): void
  }
