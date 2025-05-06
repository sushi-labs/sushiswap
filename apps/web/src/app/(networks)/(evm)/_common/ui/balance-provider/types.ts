import type { EvmChainId, ID, LowercaseMap } from 'sushi'
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

export type TokenId = ID | { address: Address; chainId: EvmChainId }

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
