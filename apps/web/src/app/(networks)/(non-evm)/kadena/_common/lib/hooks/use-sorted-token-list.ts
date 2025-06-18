import { useDebounce } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import type { Token } from '~aptos/_common/lib/types/token'
import {
  filterTokens,
  getSortedTokensByQuery,
  tokenComparator,
} from '~kadena/_common/lib/utils/token-search-helpers'
import type {
  KadenaToken,
  TokenWithBalance,
} from '~kadena/_common/types/token-type'

interface Params {
  query: string
  tokenMap: Record<string, KadenaToken> | undefined
  customTokenMap: Record<string, KadenaToken> | undefined
  balanceMap: Record<string, number> | undefined
  chainId?: number
}

export const useSortedTokenList = ({
  query,
  tokenMap,
  customTokenMap,
  balanceMap,
}: Params) => {
  const debouncedQuery = useDebounce(query, 250)
  return useQuery({
    queryKey: [
      'sortedTokenList',
      { debouncedQuery, tokenMap, balanceMap, customTokenMap },
    ],
    queryFn: async () => {
      const tokenMapValues = tokenMap ? Object.values(tokenMap) : []
      const customTokenMapValues = customTokenMap
        ? Object.values(customTokenMap)
        : []
      const filteredTokens: KadenaToken[] = filterTokens(
        tokenMapValues,
        debouncedQuery,
      )
      const filteredCustomTokens: KadenaToken[] = filterTokens(
        customTokenMapValues,
        debouncedQuery,
      )
      // const sortedTokens
      const sortedTokens: KadenaToken[] = [
        ...filteredTokens,
        ...filteredCustomTokens,
      ].sort(tokenComparator())
      const filteredSortedTokens = getSortedTokensByQuery(
        sortedTokens,
        debouncedQuery,
      )
      if (balanceMap) {
        filteredSortedTokens.forEach((token) => {
          ;(token as unknown as TokenWithBalance).balance = String(
            balanceMap[token.tokenAddress] || 0,
          )
        })
        filteredSortedTokens.sort((a, b) => {
          const aBalance = Number((a as unknown as TokenWithBalance).balance)
          const bBalance = Number((b as unknown as TokenWithBalance).balance)
          if (aBalance === bBalance) {
            return 0
          }
          return aBalance > bBalance ? -1 : 1
        })
      }
      return filteredSortedTokens as TokenWithBalance[] | KadenaToken[]
    },
  })
}
