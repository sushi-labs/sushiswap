import { JsonRpcProvider } from '@ethersproject/providers'
import { nanoid } from '@reduxjs/toolkit'
import type { TokenList } from '@uniswap/token-lists'
import { useMemo } from 'react'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { UNSUPPORTED_TOKEN_LIST_URLS } from './constants'
import { TokenListsContext } from './context'
import { WrappedTokenInfo } from './token'
import { ChainTokenMap, WithTokenListsState } from './types'
import UNSUPPORTED_TOKEN_LIST from './unsupported.tokenlist.json'
import { getTokenList, resolveENSContentHash, sortByListPriority, tokensToChainTokenMap } from './utils'

export function useFetchListCallback(
  context: TokenListsContext,
  chainId: number,
  library: JsonRpcProvider
): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
  const { actions } = context
  const dispatch = useDispatch()

  const ensResolver = useCallback((ensName: string) => resolveENSContentHash(ensName, library), [library])

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid()
      sendDispatch && dispatch(actions.pending({ requestId, url: listUrl }))
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          sendDispatch && dispatch(actions.fulfilled({ url: listUrl, tokenList, requestId }))
          return tokenList
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error)
          sendDispatch &&
            dispatch(
              actions.rejected({
                url: listUrl,
                requestId,
                errorMessage: error.message,
              })
            )
          throw error
        })
    },
    [actions, dispatch, ensResolver]
  )
}

export type TokenAddressMap = ChainTokenMap

type Mutable<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>
}

export function useAllLists(context: TokenListsContext) {
  const { reducerPath } = context
  return useSelector((state: WithTokenListsState) => state[reducerPath].byUrl)
}

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null

export function listToTokenMap(list: TokenList): TokenAddressMap {
  const result = listCache?.get(list)
  if (result) return result

  const map = list.tokens.reduce<TokenAddressMap>((tokenMap, tokenInfo) => {
    const token = new WrappedTokenInfo(tokenInfo, list)
    if (tokenMap[token.chainId]?.[token.address] !== undefined) {
      console.error(new Error(`Duplicate token! ${token.address}`))
      return tokenMap
    }
    return {
      ...tokenMap,
      [token.chainId]: {
        ...tokenMap[token.chainId],
        [token.address]: {
          token,
          list,
        },
      },
    }
  }, {})
  listCache?.set(list, map)
  return map
}

/**
 * Combine the tokens in map2 with the tokens on map1, where tokens on map1 take precedence
 * @param map1 the base token map
 * @param map2 the map of additioanl tokens to add to the base map
 */
export function combineMaps(map1: TokenAddressMap, map2: TokenAddressMap): TokenAddressMap {
  const chainIds = Object.keys(
    Object.keys(map1)
      .concat(Object.keys(map2))
      .reduce<{ [chainId: string]: true }>((memo, value) => {
        memo[value] = true
        return memo
      }, {})
  ).map((id) => parseInt(id))

  return chainIds.reduce<Mutable<TokenAddressMap>>((memo, chainId) => {
    memo[chainId] = {
      ...map2[chainId],
      // map1 takes precedence
      ...map1[chainId],
    }
    return memo
  }, {}) as TokenAddressMap
}

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(context: TokenListsContext, urls: string[] | undefined): TokenAddressMap {
  const lists = useAllLists(context)
  return useMemo(() => {
    if (!urls) return {}
    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current
          if (!current) return allTokens
          try {
            return combineMaps(allTokens, tokensToChainTokenMap(current))
          } catch (error) {
            console.error('Could not show token list due to error', error)
            return allTokens
          }
        }, {})
    )
  }, [lists, urls])
}

// filter out unsupported lists
export function useActiveListUrls(context: TokenListsContext): string[] | undefined {
  const { reducerPath } = context
  const activeListUrls = useSelector((state: WithTokenListsState) => state[reducerPath].activeListUrls)
  return useMemo(() => activeListUrls?.filter((url) => !UNSUPPORTED_TOKEN_LIST_URLS.includes(url)), [activeListUrls])
}

export function useInactiveListUrls(context: TokenListsContext): string[] {
  const lists = useAllLists(context)
  const allActiveListUrls = useActiveListUrls(context)
  return useMemo(
    () =>
      Object.keys(lists).filter(
        (url) => !allActiveListUrls?.includes(url) && !UNSUPPORTED_TOKEN_LIST_URLS.includes(url)
      ),
    [lists, allActiveListUrls]
  )
}

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList(context: TokenListsContext): TokenAddressMap {
  const activeListUrls = useActiveListUrls(context)

  const activeTokens = useCombinedTokenMapFromUrls(context, activeListUrls)

  return activeTokens
}

// list of tokens not supported on interface, used to show warnings and prevent swaps and adds
export function useUnsupportedTokenList(context: TokenListsContext): TokenAddressMap {
  // get hard coded unsupported tokens
  const localUnsupportedListMap = listToTokenMap(UNSUPPORTED_TOKEN_LIST)

  // get any loaded unsupported tokens
  const loadedUnsupportedListMap = useCombinedTokenMapFromUrls(context, UNSUPPORTED_TOKEN_LIST_URLS)

  // format into one token address map
  return useMemo(
    () => combineMaps(localUnsupportedListMap, loadedUnsupportedListMap),
    [localUnsupportedListMap, loadedUnsupportedListMap]
  )
}

export function useIsListActive(context: TokenListsContext, url: string): boolean {
  const activeListUrls = useActiveListUrls(context)
  return Boolean(activeListUrls?.includes(url))
}
