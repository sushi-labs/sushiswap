import { useDebounce } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import type { Amount } from 'sushi'
import type { StellarToken } from 'sushi/stellar'
import {
  filterTokens,
  getSortedTokensByQuery,
} from './get-sorted-tokens-by-query'

interface Params {
  query: string
  tokenMap?: Record<string, StellarToken>
  balanceMap?: ReadonlyMap<string, Amount<StellarToken>>
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

      // Stable sort by balance descending. Compare raw quotients so two
      // tokens with different decimals still order correctly relative
      // to each other (a higher raw bigint with more decimals can be
      // worth less than a smaller bigint with fewer decimals, but the
      // selector has always sorted on raw units — keep that behavior).
      return sorted.toSorted((a, b) => {
        const aBalance = balanceMap.get(a.id)?.amount ?? 0n
        const bBalance = balanceMap.get(b.id)?.amount ?? 0n
        if (aBalance === bBalance) return 0
        return aBalance > bBalance ? -1 : 1
      })
    },
  })
}
