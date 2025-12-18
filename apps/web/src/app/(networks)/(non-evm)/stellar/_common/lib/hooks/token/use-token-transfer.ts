'use client'

import { useMutation } from '@tanstack/react-query'
import { transferFromToken, transferToken } from '../../soroban/token-helpers'

export interface TransferTokenParams {
  to: string
  amount: bigint
  tokenAddress: string
}

export interface TransferFromTokenParams {
  from: string
  to: string
  amount: bigint
  tokenAddress: string
}

export const useTransferToken = () => {
  return useMutation({
    mutationKey: ['stellar', 'token', 'transfer'],
    mutationFn: async (params: TransferTokenParams) => {
      return await transferToken(params.to, params.amount, params.tokenAddress)
    },
    onSuccess: () => {
      console.log('Token transfer successful')
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
    onSuccess: () => {
      console.log('Token transfer from successful')
    },
    onError: (error) => {
      console.error('Failed to transfer from token:', error)
    },
  })
}
