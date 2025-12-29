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
    queryKey: ['stellar', 'token', 'balance', address, tokenContractId],
    queryFn: async () => {
      if (!address || !tokenContractId) {
        return null
      }
      return await getTokenBalance(address, tokenContractId)
    },
    enabled: Boolean(address && tokenContractId),
  })
}

export const useTokenBalanceFromToken = (
  address: string | null,
  token: Token | null,
) => {
  return useQuery({
    queryKey: [
      'stellar',
      'token',
      'balanceFromToken',
      address,
      token?.contract,
    ],
    queryFn: async () => {
      if (!address || !token) {
        return null
      }
      return await getTokenBalanceFromToken(address, token)
    },
    enabled: Boolean(address && token),
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
    queryKey: ['stellar', 'token', 'balances', tokens, address],
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
          })
        } catch (error) {
          console.error(
            `Failed to get ${token.contract} token balance for ${address}`,
            error,
          )
        }
      }
      return tokensWithBalances
    },
    enabled: Boolean(address && tokens),
  })
}

/**
 * Fetches token balances and returns them as a map (contract -> balance as string)
 * Returns strings to avoid BigInt serialization issues with React Query
 * @param address - The address to get the balances of
 * @param contracts - Array of token contract addresses
 * @returns A map of contract addresses to balance amounts (as strings)
 */
export const useTokenBalancesMap = (
  address: string | null,
  contracts: string[],
) => {
  return useQuery({
    queryKey: ['stellar', 'token', 'balancesMap', address, contracts],
    queryFn: async () => {
      if (!address || contracts.length === 0) {
        return contracts.reduce<Record<string, string>>((acc, contract) => {
          acc[contract] = '0'
          return acc
        }, {})
      }

      const balanceMap: Record<string, string> = {}

      for (const contract of contracts) {
        try {
          const balance = await getTokenBalance(address, contract)
          balanceMap[contract] = balance.toString()
        } catch (error) {
          console.error(`Error fetching balance for ${contract}:`, error)
          balanceMap[contract] = '0'
        }
      }

      return balanceMap
    },
    enabled: Boolean(address && contracts.length > 0),
  })
}
