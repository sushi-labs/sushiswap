import type { TokenListsContext } from './context'
import {
  useActiveListUrls as _useActiveListUrls,
  useAllLists as _useAllLists,
  useCombinedActiveList as _useCombinedActiveList,
  useFetchListCallback as _useFetchListCallback,
  useInactiveListUrls as _useInactiveListUrls,
  useIsListActive as _useIsListActive,
  useUnsupportedTokenList as _useUnsupportedTokenList,
} from './hooks'
import { createTokenListsSlice } from './slice'
import { createUpdater } from './updater'

type RemoveFirstFromTuple<T extends any[]> = T['length'] extends 0
  ? undefined
  : ((...b: T) => void) extends (a: any, ...b: infer I) => void
  ? I
  : []

type ParamsWithoutContext<T extends (...args: any) => any> = RemoveFirstFromTuple<Parameters<T>>

export interface TokenListsOptions {
  reducerPath?: string
}

// Inspired by RTK Query's createApi
export function createTokenLists(options?: TokenListsOptions) {
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

  const hooks = {
    useAllLists,
    useActiveListUrls,
    useInactiveListUrls,
    useCombinedActiveList,
    useUnsupportedTokenList,
    useIsListActive,
    useFetchListCallback,
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
