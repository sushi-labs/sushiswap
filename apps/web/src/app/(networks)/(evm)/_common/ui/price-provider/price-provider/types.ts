import type { EvmChainId } from 'sushi/evm'
import type { SvmAddress, SvmChainId } from 'sushi/svm'
import type { PriceWorkerReceiveMessageChainState } from '../price-worker/types'

type PriceMapKey<TChainId extends EvmChainId | SvmChainId> =
  TChainId extends EvmChainId ? bigint : SvmAddress

export interface ProviderChainState<
  TChainId extends EvmChainId | SvmChainId = EvmChainId,
> {
  chainId: TChainId

  priceMap?: Map<PriceMapKey<TChainId>, number>

  lastModified: number

  isLoading: boolean
  isUpdating: boolean
  isError: boolean
}

export interface ProviderState<
  TChainId extends EvmChainId | SvmChainId = EvmChainId,
> {
  chains: Map<TChainId, ProviderChainState<TChainId>>
  ready: boolean
}

export interface ProviderMutations<
  TChainId extends EvmChainId | SvmChainId = EvmChainId,
> {
  incrementChainId: (chainId: TChainId) => void
  decrementChainId: (chainId: TChainId) => void
  requestPrices: (chainId: SvmChainId, addresses: SvmAddress[]) => void
}

export interface Provider<
  TChainId extends EvmChainId | SvmChainId = EvmChainId,
> {
  state: ProviderState<TChainId>
  mutate: ProviderMutations<TChainId>
}

export type ProviderActions<
  TChainId extends EvmChainId | SvmChainId = EvmChainId,
> = {
  type: 'UPDATE_CHAIN_STATE'
  payload: PriceWorkerReceiveMessageChainState<TChainId>['payload']
}
