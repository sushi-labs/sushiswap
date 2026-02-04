import { useDebounce } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import type { Token } from '~stellar/_common/lib/types/token.type'
import {
  filterTokens,
  getSortedTokensByQuery,
} from './get-sorted-tokens-by-query'

interface Params {
  query: string
  tokenMap?: Record<string, Token>
  balanceMap?: Record<string, string>
}

export const useSortedTokenList = ({ query, tokenMap, balanceMap }: Params) => {
  const debouncedQuery = useDebounce(query, 250)
  return useQuery({
    queryKey: [
      'stellar',
      'sortedTokenList',
      {
        debouncedQuery,
        tokenContracts: tokenMap ? Object.keys(tokenMap) : [],
        hasBalances: !!balanceMap,
      },
    ],
    queryFn: async () => {
      const tokenMapValues = tokenMap ? Object.values(tokenMap) : []
      const filteredTokens: Token[] = filterTokens(
        tokenMapValues,
        debouncedQuery,
      )
      const filteredSortedTokens = getSortedTokensByQuery(
        filteredTokens,
        debouncedQuery,
      )

      // Sort by balance if provided (convert to BigInt for comparison, store as string)
      if (balanceMap) {
        const tokensWithBalance = filteredSortedTokens.map((token) => {
          return {
            ...token,
            balance: balanceMap[token.contract] || '0',
          }
        })
        const sortedTokensWithBalance = tokensWithBalance.sort((a, b) => {
          const aBalance = BigInt(a.balance || '0')
          const bBalance = BigInt(b.balance || '0')
          if (aBalance === bBalance) {
            return 0
          }
          return aBalance > bBalance ? -1 : 1
        })
        return sortedTokensWithBalance
      }

      return filteredSortedTokens
    },
  })
}
