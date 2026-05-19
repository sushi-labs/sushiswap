'use client'

import { useQuery } from '@tanstack/react-query'
import type {
  StellarAccountAddress,
  StellarContractAddress,
  StellarToken,
} from 'sushi/stellar'
import {
  getTokenBalance,
  getTokenBalanceFromToken,
} from '../../soroban/token-helpers'

export type TokenWithBalance = { token: StellarToken; balance: bigint }

export const useTokenBalance = (
  address: StellarAccountAddress | undefined,
  tokenContractId: StellarContractAddress | null,
) => {
  return useQuery({
    queryKey: ['stellar', 'token', 'balance', address, tokenContractId],
    queryFn: async () => {
      if (!address || !tokenContractId) {
        throw new Error('Address and token contract ID are required')
      }
      return await getTokenBalance(address, tokenContractId)
    },
    enabled: Boolean(address && tokenContractId),
  })
}

export const useTokenBalanceFromToken = (
  address: StellarAccountAddress | null,
  token: StellarToken | null,
) => {
  return useQuery({
    queryKey: ['stellar', 'token', 'balanceFromToken', address, token?.address],
    queryFn: async () => {
      if (!address || !token) {
        throw new Error('Address and token are required')
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
export const useTokenBalances = (
  address: StellarAccountAddress | undefined,
  tokens: StellarToken[],
) => {
  return useQuery({
    queryKey: ['stellar', 'token', 'balances', tokens, address],
    queryFn: async () => {
      if (!address || tokens.length === 0 || !tokens) {
        return []
      }
      const tokensWithBalances: TokenWithBalance[] = []
      for (const token of tokens) {
        if (!token.address) continue
        try {
          const balance = await getTokenBalance(address, token.address)
          tokensWithBalances.push({ token, balance })
        } catch (error) {
          console.error(
            `Failed to get ${token.address} token balance for ${address}`,
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
  address: StellarAccountAddress | undefined,
  contracts: StellarContractAddress[],
) => {
  return useQuery({
    queryKey: ['stellar', 'token', 'balancesMap', address, contracts],
    queryFn: async () => {
      if (!address || contracts.length === 0) {
        return contracts.reduce(
          (acc, contract) => {
            acc[contract] = '0'
            return acc
          },
          {} as Record<StellarContractAddress, string>,
        )
      }

      const balanceMap = {} as Record<StellarContractAddress, string>

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
