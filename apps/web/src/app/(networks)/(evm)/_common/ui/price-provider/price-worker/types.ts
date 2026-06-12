import type { EvmChainId } from 'sushi/evm'
import type { StellarChainId, StellarContractAddress } from 'sushi/stellar'
import type { SvmAddress, SvmChainId } from 'sushi/svm'

export type PriceWorkerChainId = EvmChainId | SvmChainId | StellarChainId
export type PriceWorkerAddress = SvmAddress | StellarContractAddress

export type PriceWorkerRequestChainId = SvmChainId
export type PriceWorkerRequestAddress =
  ContractAddressFor<PriceWorkerRequestChainId>

export enum PriceWorkerPostMessageType {
  Initialize = 'Initialize',
  IncrementChainId = 'IncrementChainId',
  DecrementChainId = 'DecrementChainId',
  RefetchChainId = 'RefetchChainId',
  RequestPrices = 'RequestPrices',
  SetEnabled = 'SetEnabled',
}
type Initialize = {
  type: PriceWorkerPostMessageType.Initialize
  canUseSharedArrayBuffer: boolean
}

type IncrementChainId<TChainId extends PriceWorkerChainId> = {
  chainId: TChainId
  type: PriceWorkerPostMessageType.IncrementChainId
}

type DecrementChainId<TChainId extends PriceWorkerChainId> = {
  chainId: TChainId
  type: PriceWorkerPostMessageType.DecrementChainId
}

type RefetchChainId<TChainId extends PriceWorkerChainId> = {
  chainId: TChainId
  type: PriceWorkerPostMessageType.RefetchChainId
}

type RequestPrices = {
  chainId: PriceWorkerRequestChainId
  addresses: PriceWorkerRequestAddress[]
  type: PriceWorkerPostMessageType.RequestPrices
}

type SetEnabled = {
  enabled: boolean
  type: PriceWorkerPostMessageType.SetEnabled
}

export type PriceWorkerPostMessage<TChainId extends PriceWorkerChainId> =
  | Initialize
  | IncrementChainId<TChainId>
  | DecrementChainId<TChainId>
  | RefetchChainId<TChainId>
  | RequestPrices
  | SetEnabled

export enum PriceWorkerReceiveMessageType {
  ChainState = 'ChainState',
}

type PriceMapKey<TChainId extends PriceWorkerChainId> =
  TChainId extends EvmChainId
    ? bigint
    : TChainId extends SvmChainId
      ? SvmAddress
      : StellarContractAddress

export interface WorkerChainState<TChainId extends PriceWorkerChainId> {
  chainId: TChainId
  listenerCount: number

  priceMap: Map<PriceMapKey<TChainId>, number>

  lastModified: number

  isLoading: boolean
  isUpdating: boolean
  isError: boolean

  request?: TChainId extends PriceWorkerRequestChainId
    ? {
        pending: Set<PriceWorkerRequestAddress>
        processing: boolean
        timestamps: number[]
      }
    : undefined
}

export type PriceWorkerReceiveMessageChainState<
  TChainId extends PriceWorkerChainId,
> = {
  type: PriceWorkerReceiveMessageType.ChainState
  payload: Partial<
    Omit<WorkerChainState<TChainId>, 'priceObject' | 'listenerCount'>
  > & {
    chainId: TChainId
  }
}

export type PriceWorkerReceiveMessage<TChainId extends PriceWorkerChainId> =
  PriceWorkerReceiveMessageChainState<TChainId>

export type PriceWorker<TChainId extends PriceWorkerChainId> =
  (typeof Worker)['prototype'] & {
    postMessage(
      message:
        | PriceWorkerPostMessage<TChainId>
        | PriceWorkerPostMessage<TChainId>[],
    ): void
  }
