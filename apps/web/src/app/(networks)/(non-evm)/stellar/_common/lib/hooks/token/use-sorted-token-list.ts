import { useQuery } from '@tanstack/react-query'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { tokenComparator } from './get-sorted-tokens-by-query'

interface Params {
  tokenMap: Record<string, Token> | undefined
  balanceMap?: Record<string, string> | undefined
}

export const useSortedTokenList = ({ tokenMap, balanceMap }: Params) => {
  return useQuery({
    queryKey: [
      'stellar',
      'sortedTokenList',
      {
        tokenContracts: tokenMap ? Object.keys(tokenMap) : [],
        hasBalances: !!balanceMap,
      },
    ],
    queryFn: async () => {
      const tokenMapValues = tokenMap ? Object.values(tokenMap) : []
      const sortedTokens: Token[] = tokenMapValues.sort(tokenComparator())

      // Sort by balance if provided (convert to BigInt for comparison, store as string)
      if (balanceMap) {
        const tokensWithBalance = sortedTokens as Array<
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

      return sortedTokens
    },
  })
}
