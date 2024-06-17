import { useQuery } from '@tanstack/react-query'
import {
  filterTokens,
  getSortedTokensByQuery,
  tokenComparator,
} from 'src/lib/wagmi/hooks/tokens/useSortedTokensByQuery'
import { ChainId } from 'sushi/chain'
import { Amount, Native, Token, Type } from 'sushi/currency'
import { Fraction } from 'sushi/math'

interface Params {
  query: string
  chainId?: ChainId
  tokenMap: Record<string, Token> | undefined
  customTokenMap: Record<string, Token> | undefined
  pricesMap?: Record<string, Fraction>
  balancesMap?: Record<string, Amount<Type>>
  includeNative?: boolean
}

// const hash = (string: string) => {
//   let hash = 0
//   for (let i = 0; i < string.length; i++) {
//     const code = string.charCodeAt(i)
//     hash = (hash << 5) - hash + code
//     hash = hash & hash // Convert to 32bit integer
//   }
//   return hash
// }

export const useSortedTokenList = ({
  query,
  chainId,
  tokenMap,
  customTokenMap,
  balancesMap,
  pricesMap,
  includeNative,
}: Params) => {
  return useQuery({
    queryKey: [
      'sortedTokenList',
      {
        query,
        tokenMap,
        customTokenMap,
        balancesMap,
        pricesMap,
        includeNative,
      },
    ],
    queryFn: async () => {
      const tokenMapValues = tokenMap ? Object.values(tokenMap) : []
      const uniqTokenMapIds: string[] = []
      const tokenMapValuesUniq = tokenMapValues.filter((el) => {
        if (uniqTokenMapIds.includes(el.address)) return false
        uniqTokenMapIds.push(el.address)
        return true
      })

      const customTokenMapValues = customTokenMap
        ? Object.values(customTokenMap).filter(
            (el) =>
              el.chainId === chainId && !uniqTokenMapIds.includes(el.address),
          )
        : []

      const _includeNative =
        includeNative &&
        chainId &&
        (!query ||
          query
            .toLowerCase()
            .includes(Native.onChain(chainId).symbol.toLowerCase()))

      const filteredTokens: Token[] = filterTokens(tokenMapValuesUniq, query)
      const filteredCustomTokens: Token[] = filterTokens(
        customTokenMapValues,
        query,
      )
      const sortedTokens: Token[] = [
        ...filteredTokens,
        ...filteredCustomTokens,
      ].sort(tokenComparator(balancesMap, pricesMap))

      const filteredSortedTokens = getSortedTokensByQuery(sortedTokens, query)

      if (_includeNative)
        return [Native.onChain(chainId), ...filteredSortedTokens]
      return filteredSortedTokens
    },
    keepPreviousData: true,
  })
}
