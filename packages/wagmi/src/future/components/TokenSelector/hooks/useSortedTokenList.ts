import { useDebounce } from '@sushiswap/hooks'
import { Amount, Native, Token, Type } from '@sushiswap/currency'
import { filterTokens, getSortedTokensByQuery, tokenComparator } from '../../../../hooks/useSortedTokensByQuery'
import { Fraction } from '@sushiswap/math'
import { useQuery } from '@tanstack/react-query'
import { ChainId } from '@sushiswap/chain'

interface Params {
  query: string
  chainId?: ChainId
  tokenMap: Record<string, Token> | undefined
  customTokenMap: Record<string, Token> | undefined
  pricesMap?: Record<string, Fraction>
  balancesMap?: Record<string, Amount<Type>>
  includeNative?: boolean
}

const hash = (string: string) => {
  let hash = 0
  for (let i = 0; i < string.length; i++) {
    const code = string.charCodeAt(i)
    hash = (hash << 5) - hash + code
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

export const useSortedTokenList = ({
  query,
  chainId,
  tokenMap,
  customTokenMap,
  balancesMap,
  pricesMap,
  includeNative,
}: Params) => {
  const debouncedQuery = useDebounce(query, 250)

  return useQuery({
    queryKey: ['sortedTokenList', { debouncedQuery, tokenMap, customTokenMap, balancesMap, pricesMap }],
    queryFn: async () => {
      const tokenMapValues = tokenMap ? Object.values(tokenMap) : []
      const tokenMapIds: string[] = tokenMapValues ? tokenMapValues.map((el) => el.address) : []
      const customTokenMapValues = customTokenMap
        ? Object.values(customTokenMap).filter((el) => el.chainId === chainId && !tokenMapIds.includes(el.address))
        : []

      const _includeNative =
        includeNative &&
        chainId &&
        (!debouncedQuery || debouncedQuery.toLowerCase().includes(Native.onChain(chainId).symbol.toLowerCase()))

      const filteredTokens: Token[] = filterTokens(tokenMapValues, debouncedQuery)
      const filteredCustomTokens: Token[] = filterTokens(customTokenMapValues, debouncedQuery)
      const sortedTokens: Token[] = [...filteredTokens, ...filteredCustomTokens].sort(
        tokenComparator(balancesMap, pricesMap)
      )

      const filteredSortedTokens = getSortedTokensByQuery(sortedTokens, debouncedQuery)
      if (_includeNative) return [Native.onChain(chainId), ...customTokenMapValues, ...filteredSortedTokens]
      return filteredSortedTokens
    },
    keepPreviousData: true,
  })
}
