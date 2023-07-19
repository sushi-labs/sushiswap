import { useDebounce } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import { Token } from './tokenType'
import { filterTokens, getSortedTokensByQuery, tokenComparator } from './useSortedTokensByQuery'

interface Params {
  query: string
  tokenMap: Record<string, Token> | undefined
  customTokenMap: Record<string, Token> | undefined
  chainId?: number
}

export const useSortedTokenList = ({ query, tokenMap, customTokenMap, chainId = 1 }: Params) => {
  const debouncedQuery = useDebounce(query, 250)
  return useQuery({
    queryKey: ['sortedTokenList', { debouncedQuery, tokenMap, customTokenMap }],
    queryFn: async () => {
      const tokenMapValues = tokenMap ? Object.values(tokenMap) : []
      const tokenMapIds = tokenMapValues ? tokenMapValues.map((el) => el.address) : []
      const customTokenMapValues = customTokenMap
        ? Object.values(customTokenMap).filter((el) => el.chainId === chainId)
        : []
      const filteredTokens: Token[] = filterTokens(tokenMapValues, debouncedQuery)
      const filteredCustomTokens: Token[] = filterTokens(customTokenMapValues, debouncedQuery)
      // const sortedTokens
      const sortedTokens: Token[] = [...filteredTokens, ...filteredCustomTokens].sort(tokenComparator())
      const filteredSortedTokens = getSortedTokensByQuery(sortedTokens, debouncedQuery)
      return filteredSortedTokens
    },
    keepPreviousData: false,
  })
}
