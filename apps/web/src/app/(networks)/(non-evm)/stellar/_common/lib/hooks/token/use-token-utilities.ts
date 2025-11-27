'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getMultipleTokenAllowances,
  getMultipleTokenBalances,
  hasSufficientAllowance,
  hasSufficientBalance,
} from '../../soroban/token-helpers'

export const useHasSufficientBalance = (
  address: string | null,
  tokenAddress: string | null,
  amount: bigint | null,
) => {
  return useQuery({
    queryKey: ['token', 'hasSufficientBalance', address, tokenAddress, amount],
    queryFn: async () => {
      if (!address || !tokenAddress || amount === null) return null
      return await hasSufficientBalance(address, tokenAddress, amount)
    },
    enabled: !!address && !!tokenAddress && amount !== null,
  })
}

export const useHasSufficientAllowance = (
  owner: string | null,
  spender: string | null,
  tokenAddress: string | null,
  amount: bigint | null,
) => {
  return useQuery({
    queryKey: [
      'token',
      'hasSufficientAllowance',
      owner,
      spender,
      tokenAddress,
      amount,
    ],
    queryFn: async () => {
      if (!owner || !spender || !tokenAddress || amount === null) return null
      return await hasSufficientAllowance(owner, spender, tokenAddress, amount)
    },
    enabled: !!owner && !!spender && !!tokenAddress && amount !== null,
  })
}

export const useMultipleTokenBalances = (
  address: string | null,
  tokenAddresses: string[],
) => {
  return useQuery({
    queryKey: ['token', 'multipleBalances', address, tokenAddresses],
    queryFn: async () => {
      if (!address || tokenAddresses.length === 0) return null
      return await getMultipleTokenBalances(address, tokenAddresses)
    },
    enabled: !!address && tokenAddresses.length > 0,
  })
}

export const useMultipleTokenAllowances = (
  owner: string | null,
  spender: string | null,
  tokenAddresses: string[],
) => {
  return useQuery({
    queryKey: ['token', 'multipleAllowances', owner, spender, tokenAddresses],
    queryFn: async () => {
      if (!owner || !spender || tokenAddresses.length === 0) return null
      return await getMultipleTokenAllowances(owner, spender, tokenAddresses)
    },
    enabled: !!owner && !!spender && tokenAddresses.length > 0,
  })
}
