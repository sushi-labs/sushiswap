import { TokenList } from '@uniswap/token-lists'
import { UNSUPPORTED_LIST_URLS } from 'app/config/token-lists'
import UNSUPPORTED_TOKEN_LIST from 'app/constants/token-lists/sushiswap-v2-unsupported.tokenlist.json'
import { sortByListPriority } from 'app/functions/list'
import { AppState } from 'app/state'
import { useAppSelector } from 'app/state/hooks'
import { ChainTokenMap, tokensToChainTokenMap } from 'lib/hooks/useTokenList/utils'
import { useMemo } from 'react'

import { WrappedTokenInfo } from './wrappedTokenInfo'

export type TokenAddressMap = ChainTokenMap

type Mutable<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>
}

export function useAllLists(): AppState['lists']['byUrl'] {
  return useAppSelector((state) => state.lists.byUrl)
}

// export type TokenAddressMap = Readonly<{
//   [chainId: number]: Readonly<{
//     [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList }
//   }>
// }>

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

// const TRANSFORMED_DEFAULT_TOKEN_LIST = listToTokenMap(DEFAULT_TOKEN_LIST)

// const TRANSFORMED_CHAINLINK_TOKEN_LIST = listToTokenMap(CHAINLINK_TOKEN_LIST)

// export function useAllLists(): AppState['lists']['byUrl'] {
//   return useAppSelector((state) => state.lists.byUrl)
// }

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
function useCombinedTokenMapFromUrls(urls: string[] | undefined): TokenAddressMap {
  const lists = useAllLists()
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

// function combineMaps(map1: TokenAddressMap, map2: TokenAddressMap): TokenAddressMap {
//   return {
//     1: { ...map1[1], ...map2[1] }, // mainnet
//     3: { ...map1[3], ...map2[3] }, // ropsten
//     4: { ...map1[4], ...map2[4] }, // rinkeby
//     5: { ...map1[5], ...map2[5] }, // goerli
//     42: { ...map1[42], ...map2[42] }, // kovan
//     250: { ...map1[250], ...map2[250] }, // fantom
//     4002: { ...map1[4002], ...map2[4002] }, // fantom testnet
//     137: { ...map1[137], ...map2[137] }, // matic
//     80001: { ...map1[80001], ...map2[80001] }, // matic testnet
//     100: { ...map1[100], ...map2[100] }, // xdai
//     56: { ...map1[56], ...map2[56] }, // bsc
//     97: { ...map1[97], ...map2[97] }, // bsc testnet
//     42161: { ...map1[42161], ...map2[42161] }, // arbitrum
//     79377087078960: { ...map1[79377087078960], ...map2[79377087078960] }, // arbitrum testnet
//     1287: { ...map1[1287], ...map2[1287] }, // moonbase
//     128: { ...map1[128], ...map2[128] }, // heco
//     256: { ...map1[256], ...map2[256] }, // heco testnet
//     43114: { ...map1[43114], ...map2[43114] }, // avax mainnet
//     43113: { ...map1[43113], ...map2[43113] }, // avax testnet fuji
//     1666600000: { ...map1[1666600000], ...map2[1666600000] }, // harmony
//     1666700000: { ...map1[1666700000], ...map2[1666700000] }, // harmony testnet
//     66: { ...map1[66], ...map2[66] }, // okex
//     65: { ...map1[65], ...map2[65] }, // okex testnet
//     42220: { ...map1[42220], ...map2[42220] }, // celo
//     11297108109: { ...map1[11297108109], ...map2[11297108109] }, // palm
//     11297108099: { ...map1[11297108099], ...map2[11297108099] }, // palm testnet
//     1285: { ...map1[1285], ...map2[1285] }, // moonriver
//     122: { ...map1[122], ...map2[122] }, // fuse
//     40: { ...map1[40], ...map2[40] }, // telos
//     1284: { ...map1[1284], ...map2[1284] }, // moonbeam
//   }
// }

// merge tokens contained within lists from urls
// function useCombinedTokenMapFromUrls(urls: string[] | undefined): TokenAddressMap {
//   const lists = useAllLists()
//   return useMemo(() => {
//     if (!urls) return {}
//     return (
//       urls
//         .slice()
//         // sort by priority so top priority goes last
//         .sort(sortByListPriority)
//         .reduce((allTokens, currentUrl) => {
//           const current = lists[currentUrl]?.current
//           if (!current) return allTokens
//           try {
//             return combineMaps(allTokens, listToTokenMap(current))
//           } catch (error) {
//             console.error('Could not show token list due to error', error)
//             return allTokens
//           }
//         }, {})
//     )
//   }, [lists, urls])
// }

// filter out unsupported lists
export function useActiveListUrls(): string[] | undefined {
  const activeListUrls = useAppSelector((state) => state.lists.activeListUrls)
  return useMemo(() => activeListUrls?.filter((url) => !UNSUPPORTED_LIST_URLS.includes(url)), [activeListUrls])
}

export function useInactiveListUrls(): string[] {
  const lists = useAllLists()
  const allActiveListUrls = useActiveListUrls()
  return useMemo(
    () => Object.keys(lists).filter((url) => !allActiveListUrls?.includes(url) && !UNSUPPORTED_LIST_URLS.includes(url)),
    [lists, allActiveListUrls]
  )
}

// get all the tokens from active lists, combine with local default tokens
// export function useCombinedActiveList(): TokenAddressMap {
//   const activeListUrls = useActiveListUrls()
//   const activeTokens = useCombinedTokenMapFromUrls(activeListUrls)
//   return useMemo(
//     () => combineMaps(combineMaps(activeTokens, TRANSFORMED_DEFAULT_TOKEN_LIST), TRANSFORMED_CHAINLINK_TOKEN_LIST),
//     [activeTokens]
//   )
// }

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList(): TokenAddressMap {
  const activeListUrls = useActiveListUrls()
  const activeTokens = useCombinedTokenMapFromUrls(activeListUrls)
  return activeTokens
}

// list of tokens not supported on interface, used to show warnings and prevent swaps and adds
export function useUnsupportedTokenList(): TokenAddressMap {
  // get hard coded unsupported tokens
  const localUnsupportedListMap = listToTokenMap(UNSUPPORTED_TOKEN_LIST)

  // get any loaded unsupported tokens
  const loadedUnsupportedListMap = useCombinedTokenMapFromUrls(UNSUPPORTED_LIST_URLS)

  // format into one token address map
  return useMemo(
    () => combineMaps(localUnsupportedListMap, loadedUnsupportedListMap),
    [localUnsupportedListMap, loadedUnsupportedListMap]
  )
}

export function useIsListActive(url: string): boolean {
  const activeListUrls = useActiveListUrls()
  return Boolean(activeListUrls?.includes(url))
}
