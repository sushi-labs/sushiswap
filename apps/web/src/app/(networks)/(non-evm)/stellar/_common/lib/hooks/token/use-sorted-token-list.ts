import { useDebounce } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import type { StellarToken } from 'sushi/stellar'
import {
  filterTokens,
  getSortedTokensByQuery,
} from './get-sorted-tokens-by-query'

interface Params {
  query: string
  tokenMap?: Record<string, StellarToken>
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
      const filtered = filterTokens(tokenMapValues, debouncedQuery)
      const sorted = getSortedTokensByQuery(filtered, debouncedQuery)

      if (!balanceMap) return sorted

      // Stable sort by balance descending. We don't attach balance to the
      // token to avoid mutating the StellarToken instance; consumers look
      // up balanceMap[token.address] directly.
      return sorted.toSorted((a, b) => {
        const aBalance = BigInt(balanceMap[a.address] || '0')
        const bBalance = BigInt(balanceMap[b.address] || '0')
        if (aBalance === bBalance) return 0
        return aBalance > bBalance ? -1 : 1
      })
    },
  })
}
