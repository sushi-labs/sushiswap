import { useDebounce } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import type { Token } from '~aptos/(common)/lib/types/token'
import {
  filterTokens,
  getSortedTokensByQuery,
  tokenComparator,
} from './get-sorted-tokens-by-query'

interface Params {
  query: string
  tokenMap: Record<string, Token> | undefined
  customTokenMap: Record<string, Token> | undefined
  balanceMap: Record<string, number> | undefined
  chainId?: number
}

export type TokenWithBalance = Token & { balance: number }

export const useSortedTokenList = ({
  query,
  tokenMap,
  customTokenMap,
  balanceMap,
}: Params) => {
  const debouncedQuery = useDebounce(query, 250)
  return useQuery({
    queryKey: ['sortedTokenList', { debouncedQuery, tokenMap, customTokenMap }],
    queryFn: async () => {
      const tokenMapValues = tokenMap ? Object.values(tokenMap) : []
      const customTokenMapValues = customTokenMap
        ? Object.values(customTokenMap)
        : []
      const filteredTokens: Token[] = filterTokens(
        tokenMapValues,
        debouncedQuery,
      )
      const filteredCustomTokens: Token[] = filterTokens(
        customTokenMapValues,
        debouncedQuery,
      )
      // const sortedTokens
      const sortedTokens: Token[] = [
        ...filteredTokens,
        ...filteredCustomTokens,
      ].sort(tokenComparator())
      const filteredSortedTokens = getSortedTokensByQuery(
        sortedTokens,
        debouncedQuery,
      )
      if (balanceMap) {
        filteredSortedTokens.forEach((token) => {
          ;(token as TokenWithBalance).balance = balanceMap[token.address] || 0
        })
        filteredSortedTokens.sort((a, b) => {
          const aBalance = (a as TokenWithBalance).balance
          const bBalance = (b as TokenWithBalance).balance
          if (aBalance === bBalance) {
            return 0
          }
          return aBalance > bBalance ? -1 : 1
        })
      }
      return filteredSortedTokens as TokenWithBalance[] | Token[]
    },
  })
}
