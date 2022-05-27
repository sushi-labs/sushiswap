import type { TokenList } from '@uniswap/token-lists'

import { WrappedTokenInfo } from './token'

export type TokenAddressMap = ChainTokenMap
export type Mutable<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>
}

export interface TokenListsState {
  readonly byUrl: {
    readonly [url: string]: {
      readonly current: TokenList | null
      readonly pendingUpdate: TokenList | null
      readonly loadingRequestId: string | null
      readonly error: string | null
    }
  }
  // this contains the default list of lists from the last time the updateVersion was called, i.e. the app was reloaded
  readonly lastInitializedDefaultListOfLists?: string[]

  // currently active lists
  readonly activeListUrls: string[] | undefined
}

export type TokenListState = TokenListsState['byUrl'][string]

export interface WithTokenListsState {
  [path: string]: TokenListsState
}

export interface PendingPayload {
  requestId: string
  url: string
}

export interface FulfilledPayload {
  url: string
  tokenList: TokenList
  requestId: string
}

export interface RejectedPayload {
  url: string
  errorMessage: string
  requestId: string
}

export type AddPayload = string

export type RemovePayload = string

export type EnablePayload = string

export type DisablePayload = string

export type AcceptPayload = string

export type TokenMap = Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list?: TokenList } }>

export type ChainTokenMap = Readonly<{ [chainId: number]: TokenMap }>
