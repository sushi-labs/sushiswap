import type { EvmChainId } from 'sushi/evm'
import type { StellarChainId } from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'
import type { PriceWorkerReceiveMessageChainState } from '../price-worker/types'

export type PriceChainId = EvmChainId | SvmChainId | StellarChainId
export type PriceRequestChainId = SvmChainId

type PriceMapKey<TChainId extends PriceChainId> = TChainId extends EvmChainId
  ? bigint
  : ContractAddressFor<TChainId>

export interface ProviderChainState<
  TChainId extends PriceChainId = EvmChainId,
> {
  chainId: TChainId

  priceMap?: Map<PriceMapKey<TChainId>, number>

  lastModified: number

  isLoading: boolean
  isUpdating: boolean
  isError: boolean
}

export interface ProviderState<TChainId extends PriceChainId = EvmChainId> {
  chains: Map<TChainId, ProviderChainState<TChainId>>
  ready: boolean
}

export interface ProviderMutations<TChainId extends PriceChainId = EvmChainId> {
  incrementChainId: (chainId: TChainId) => void
  decrementChainId: (chainId: TChainId) => void
  requestPrices: (
    chainId: TChainId & PriceRequestChainId,
    addresses: ContractAddressFor<TChainId>[],
  ) => void
}

export interface Provider<TChainId extends PriceChainId = EvmChainId> {
  state: ProviderState<TChainId>
  mutate: ProviderMutations<TChainId>
}

export type ProviderActions<TChainId extends PriceChainId = EvmChainId> = {
  type: 'UPDATE_CHAIN_STATE'
  payload: PriceWorkerReceiveMessageChainState<TChainId>['payload']
}
