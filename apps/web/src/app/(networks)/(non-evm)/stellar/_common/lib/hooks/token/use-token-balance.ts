'use client'

import { useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'
import {
  getTokenBalance,
  getTokenBalanceFromToken,
} from '../../soroban/token-helpers'
import type { Token, TokenWithBalance } from '../../types/token.type'

export const useTokenBalance = (
  address: string | null,
  tokenContractId: string | null,
) => {
  return useQuery({
    queryKey: ['token', 'balance', address, tokenContractId],
    queryFn: async () => {
      if (!address || !tokenContractId) return null
      return await getTokenBalance(address, tokenContractId)
    },
    enabled: !!address && !!tokenContractId,
  })
}

export const useTokenBalanceFromToken = (
  address: string | null,
  token: Token | null,
) => {
  return useQuery({
    queryKey: ['token', 'balanceFromToken', address, token?.contract],
    queryFn: async () => {
      if (!address || !token) return null
      return await getTokenBalanceFromToken(address, token)
    },
    enabled: !!address && !!token,
  })
}

/**
 * Cycles through a list of tokens and queries each token contract for the user's balance.
 * @param address - The address to get the balances of
 * @param tokens - The list of `Token`s to get balances for
 * @returns The original tokens array with new `balance` and `balanceFormatted` fields for each
 */
export const useTokenBalances = (address: string | null, tokens: Token[]) => {
  return useQuery({
    queryKey: ['token', 'balances', tokens],
    queryFn: async () => {
      if (!address || tokens.length === 0 || !tokens) {
        return []
      }
      const tokensWithBalances: TokenWithBalance[] = []
      for (const token of tokens) {
        if (!token.contract) continue
        try {
          const balance = await getTokenBalance(address, token.contract)
          tokensWithBalances.push({
            ...token,
            balance,
            balanceFormatted: formatUnits(balance, token.decimals),
          })
        } catch (error) {
          console.error(error)
        }
      }
      return tokensWithBalances
    },
    enabled: !!address || !!tokens,
  })
}
