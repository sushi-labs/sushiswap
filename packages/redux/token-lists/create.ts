import { AnyAction, CaseReducerActions, Reducer, SliceCaseReducers } from '@reduxjs/toolkit'

import type { TokenListsContext } from './context'
import {
  useActiveListUrls as _useActiveListUrls,
  useAllLists as _useAllLists,
  useCombinedActiveList as _useCombinedActiveList,
  useFetchListCallback as _useFetchListCallback,
  useInactiveListUrls as _useInactiveListUrls,
  useIsListActive as _useIsListActive,
  useTokens as _useTokensCallback,
  useUnsupportedTokenList as _useUnsupportedTokenList,
} from './hooks'
import { createTokenListsSlice } from './slice'
import { TokenListsState } from './types'
import { createUpdater, UpdaterProps } from './updater'

type RemoveFirstFromTuple<T extends any[]> = T['length'] extends 0
  ? undefined
  : ((...b: T) => void) extends (a: any, ...b: infer I) => void
  ? I
  : []

type ParamsWithoutContext<T extends (...args: any) => any> = RemoveFirstFromTuple<Parameters<T>>

export interface TokenListsOptions {
  reducerPath?: string
}

export type TokenListHooks = {
  useAllLists: (...args: ParamsWithoutContext<typeof _useAllLists>) => ReturnType<typeof _useAllLists>
  useActiveListUrls: (...args: ParamsWithoutContext<typeof _useActiveListUrls>) => ReturnType<typeof _useActiveListUrls>
  useInactiveListUrls: (
    ...args: ParamsWithoutContext<typeof _useInactiveListUrls>
  ) => ReturnType<typeof _useInactiveListUrls>
  useCombinedActiveList: (
    ...args: ParamsWithoutContext<typeof _useCombinedActiveList>
  ) => ReturnType<typeof _useCombinedActiveList>
  useUnsupportedTokenList: (
    ...args: ParamsWithoutContext<typeof _useUnsupportedTokenList>
  ) => ReturnType<typeof _useUnsupportedTokenList>
  useIsListActive: (...args: ParamsWithoutContext<typeof _useIsListActive>) => ReturnType<typeof _useIsListActive>
  useFetchListCallback: (
    ...args: ParamsWithoutContext<typeof _useFetchListCallback>
  ) => ReturnType<typeof _useFetchListCallback>
  useTokens: (...args: ParamsWithoutContext<typeof _useTokensCallback>) => ReturnType<typeof _useTokensCallback>
}

// Inspired by RTK Query's createApi
export function createTokenLists(options?: TokenListsOptions): {
  reducerPath: string
  reducer: Reducer<TokenListsState, AnyAction>
  actions: CaseReducerActions<SliceCaseReducers<TokenListsState>, string>
  hooks: TokenListHooks
  Updater(props: Omit<UpdaterProps, 'context'>): JSX.Element
} {
  const reducerPath = options?.reducerPath ?? 'token-lists'
  const slice = createTokenListsSlice(reducerPath)
  const { actions, reducer } = slice
  const context: TokenListsContext = { reducerPath, actions }

  const useAllLists = (...args: ParamsWithoutContext<typeof _useAllLists>) => _useAllLists(context, ...args)
  const useActiveListUrls = (...args: ParamsWithoutContext<typeof _useActiveListUrls>) =>
    _useActiveListUrls(context, ...args)
  const useInactiveListUrls = (...args: ParamsWithoutContext<typeof _useInactiveListUrls>) =>
    _useInactiveListUrls(context, ...args)
  const useCombinedActiveList = (...args: ParamsWithoutContext<typeof _useCombinedActiveList>) =>
    _useCombinedActiveList(context, ...args)
  const useUnsupportedTokenList = (...args: ParamsWithoutContext<typeof _useUnsupportedTokenList>) =>
    _useUnsupportedTokenList(context, ...args)
  const useIsListActive = (...args: ParamsWithoutContext<typeof _useIsListActive>) => _useIsListActive(context, ...args)
  const useFetchListCallback = (...args: ParamsWithoutContext<typeof _useFetchListCallback>) =>
    _useFetchListCallback(context, ...args)
  const useTokens = (...args: ParamsWithoutContext<typeof _useTokensCallback>) => _useTokensCallback(context, ...args)

  const hooks: TokenListHooks = {
    useAllLists,
    useActiveListUrls,
    useInactiveListUrls,
    useCombinedActiveList,
    useUnsupportedTokenList,
    useIsListActive,
    useFetchListCallback,
    useTokens,
  }

  const Updater = createUpdater(context)

  return {
    reducerPath,
    reducer,
    actions,
    hooks,
    Updater,
  }
}
