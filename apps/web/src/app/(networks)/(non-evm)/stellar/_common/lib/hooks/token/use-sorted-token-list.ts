import { useDebounce } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import { getTokenMetadata } from '../../soroban/token-helpers'
import type { Token } from '~stellar/_common/lib/types/token.type'
import {
  filterTokens,
  getSortedTokensByQuery,
  tokenComparator,
} from './get-sorted-tokens-by-query'

interface Params {
  query: string
  tokenMap: Record<string, Token> | undefined
  balanceMap?: Record<string, string> | undefined
}

// Check if query looks like a Stellar contract address (starts with C and is 56 chars)
function isContractAddress(query: string): boolean {
  return query.startsWith('C') && query.length === 56
}

// Check if query looks like a Stellar classic asset address (starts with G and is 56 chars)
function isClassicAddress(query: string): boolean {
  return query.startsWith('G') && query.length === 56
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
      const sortedTokens: Token[] = filteredTokens.sort(tokenComparator())
      let filteredSortedTokens = getSortedTokensByQuery(
        sortedTokens,
        debouncedQuery,
      )

      // If searching by contract address and no results found, try to fetch token info from chain
      if (
        filteredSortedTokens.length === 0 &&
        (isContractAddress(debouncedQuery) || isClassicAddress(debouncedQuery))
      ) {
        try {
          const metadata = await getTokenMetadata(debouncedQuery)
          if (metadata?.symbol) {
            // Create a token object from the fetched metadata
            const customToken: Token = {
              contract: debouncedQuery,
              code: metadata.symbol,
              name: metadata.name || metadata.symbol,
              decimals: metadata.decimals,
              icon: undefined, // No icon for custom tokens
              issuer: '',
              org: 'custom',
              isStable: false,
            }
            filteredSortedTokens = [customToken]
          }
        } catch (error) {
          console.warn('Failed to fetch token metadata for:', debouncedQuery, error)
          // Return empty array if we can't fetch the token
        }
      }

      // Sort by balance if provided (convert to BigInt for comparison, store as string)
      if (balanceMap) {
        const tokensWithBalance = filteredSortedTokens as Array<
          Token & { balance?: string }
        >
        tokensWithBalance.forEach((token) => {
          token.balance = balanceMap[token.contract] || '0'
        })
        tokensWithBalance.sort((a, b) => {
          const aBalance = BigInt(a.balance || '0')
          const bBalance = BigInt(b.balance || '0')
          if (aBalance === bBalance) {
            return 0
          }
          return aBalance > bBalance ? -1 : 1
        })
        return tokensWithBalance
      }

      return filteredSortedTokens
    },
  })
}
