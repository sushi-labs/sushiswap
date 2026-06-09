'use client'

import { useQuery } from '@tanstack/react-query'
import {
  type StellarAddress,
  type StellarContractAddress,
  isStellarContractAddress,
} from 'sushi/stellar'
import {
  getMultipleTokenAllowances,
  getMultipleTokenBalances,
  hasSufficientAllowance,
  hasSufficientBalance,
} from '../../soroban/token-helpers'

export const useHasSufficientBalance = (
  address: StellarAddress | null,
  tokenAddress: StellarContractAddress | null,
  amount: bigint | null,
) => {
  return useQuery({
    queryKey: [
      'stellar',
      'token',
      'hasSufficientBalance',
      address,
      tokenAddress,
      amount,
    ],
    queryFn: async () => {
      if (!address || !tokenAddress || amount === null) {
        return null
      }
      return await hasSufficientBalance(address, tokenAddress, amount)
    },
    enabled: Boolean(address && tokenAddress && amount !== null),
  })
}

export const useHasSufficientAllowance = (
  owner: StellarAddress | null,
  spender: StellarAddress | null,
  tokenAddress: StellarContractAddress | null,
  amount: bigint | null,
) => {
  return useQuery({
    queryKey: [
      'stellar',
      'token',
      'hasSufficientAllowance',
      owner,
      spender,
      tokenAddress,
      amount,
    ],
    queryFn: async () => {
      if (
        !owner ||
        !spender ||
        !tokenAddress ||
        !isStellarContractAddress(tokenAddress) ||
        amount === null
      ) {
        return null
      }
      return await hasSufficientAllowance(owner, spender, tokenAddress, amount)
    },
    enabled: Boolean(
      owner &&
        spender &&
        tokenAddress &&
        isStellarContractAddress(tokenAddress) &&
        amount !== null,
    ),
  })
}

export const useMultipleTokenBalances = (
  address: StellarAddress | null,
  tokenAddresses: StellarContractAddress[],
) => {
  return useQuery({
    queryKey: ['stellar', 'token', 'multipleBalances', address, tokenAddresses],
    queryFn: async () => {
      if (!address || tokenAddresses.length === 0) {
        throw new Error('Address and token addresses are required')
      }
      return await getMultipleTokenBalances(address, tokenAddresses)
    },
    enabled: Boolean(address && tokenAddresses.length > 0),
  })
}

export const useMultipleTokenAllowances = (
  owner: StellarAddress | null,
  spender: StellarAddress | null,
  tokenAddresses: StellarContractAddress[],
) => {
  return useQuery({
    queryKey: [
      'stellar',
      'token',
      'multipleAllowances',
      owner,
      spender,
      tokenAddresses,
    ],
    queryFn: async () => {
      if (!owner || !spender || tokenAddresses.length === 0) {
        throw new Error('Owner, spender, and token addresses are required')
      }
      return await getMultipleTokenAllowances(owner, spender, tokenAddresses)
    },
    enabled: Boolean(owner && spender && tokenAddresses.length > 0),
  })
}
