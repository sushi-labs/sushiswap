import type { LowercaseMap } from 'sushi'
import type { EvmChainId, EvmID } from 'sushi/evm'
import type { SvmChainId } from 'sushi/svm'
import type { Address } from 'viem'

export interface Balance {
  amount: bigint
  lastUpdated: number
}

type ListenerCount = number

export interface ProviderChainState {
  chainId: EvmChainId

  isFetching: boolean

  activeTokens: LowercaseMap<Address, ListenerCount>
  balanceMap: LowercaseMap<Address, Balance>
}

export interface ProviderState {
  account: Address | undefined
  chains: Map<EvmChainId, ProviderChainState>
}

export type TokenId = EvmID | { address: Address; chainId: EvmChainId }

export interface ProviderMutations {
  incrementToken: (tokenId: TokenId | TokenId[]) => void
  decrementToken: (tokenId: TokenId | TokenId[]) => void

  refetchChain: (chainId: EvmChainId) => void
}

export interface Provider {
  state: ProviderState
  mutate: ProviderMutations
}

export type ProviderActionIncrementToken = {
  type: 'INCREMENT_TOKEN'
  payload: TokenId | TokenId[]
}

export type ProviderActionDecrementToken = {
  type: 'DECREMENT_TOKEN'
  payload: TokenId | TokenId[]
}

export type ProviderActionUpdateAccount = {
  type: 'UPDATE_ACCOUNT'
  payload: Address | undefined
}

export type ProviderActionRefresh = {
  type: 'REFRESH'
}

export type ProviderActions =
  | ProviderActionIncrementToken
  | ProviderActionDecrementToken
  | ProviderActionUpdateAccount
  | ProviderActionRefresh

export type UseBalancesReturn<TChainId extends EvmChainId | SvmChainId> =
  | {
      data: undefined
      isError: boolean
      isLoading: boolean
      isFetching: boolean
    }
  | {
      data: ReadonlyMap<AddressFor<TChainId>, bigint>
      isError: boolean
      isLoading: boolean
      isFetching: boolean
    }
