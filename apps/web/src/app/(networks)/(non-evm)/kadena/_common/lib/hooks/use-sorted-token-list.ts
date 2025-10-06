import { useDebounce } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import { Amount } from 'sushi'
import type { KvmToken } from 'sushi/kvm'
import {
  filterTokens,
  getSortedTokensByQuery,
  tokenComparator,
} from '~kadena/_common/lib/utils/token-search-helpers'

interface Params {
  query: string
  tokenMap: Record<string, KvmToken> | undefined
  customTokenMap: Record<string, KvmToken> | undefined
  balanceMap: Record<string, string> | undefined
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
      const filteredTokens: KvmToken[] = filterTokens(
        tokenMapValues,
        debouncedQuery,
      )
      const filteredCustomTokens: KvmToken[] = filterTokens(
        customTokenMapValues,
        debouncedQuery,
      )
      // const sortedTokens
      const sortedTokens: KvmToken[] = [
        ...filteredTokens,
        ...filteredCustomTokens,
      ].sort(tokenComparator())
      const filteredSortedTokens = getSortedTokensByQuery(
        sortedTokens,
        debouncedQuery,
      )

      if (balanceMap) {
        const tokenAmounts = filteredSortedTokens.map((token) => {
          return new Amount(token, balanceMap[token.address] ?? 0n)
        })
        tokenAmounts.sort((a, b) => {
          if (a.eq(b)) {
            return 0
          }
          return a.gt(b) ? -1 : 1
        })
        return tokenAmounts
      } else {
        return filteredSortedTokens.map((token) => {
          return new Amount(token, 0n)
        })
      }
    },
  })
}
