'use client'

import { useMutation } from '@tanstack/react-query'
import type { StellarAddress, StellarContractAddress } from 'sushi/stellar'
import { transferFromToken, transferToken } from '../../soroban/token-helpers'

export interface TransferTokenParams {
  to: StellarAddress
  amount: bigint
  tokenAddress: StellarContractAddress
}

export interface TransferFromTokenParams {
  from: StellarAddress
  to: StellarAddress
  amount: bigint
  tokenAddress: StellarContractAddress
}

export const useTransferToken = () => {
  return useMutation({
    mutationKey: ['stellar', 'token', 'transfer'],
    mutationFn: async (params: TransferTokenParams) => {
      return await transferToken(params.to, params.amount, params.tokenAddress)
    },
    onError: (error) => {
      console.error('Failed to transfer token:', error)
    },
  })
}

export const useTransferFromToken = () => {
  return useMutation({
    mutationKey: ['stellar', 'token', 'transferFrom'],
    mutationFn: async (params: TransferFromTokenParams) => {
      return await transferFromToken(
        params.from,
        params.to,
        params.amount,
        params.tokenAddress,
      )
    },
    onError: (error) => {
      console.error('Failed to transfer from token:', error)
    },
  })
}
