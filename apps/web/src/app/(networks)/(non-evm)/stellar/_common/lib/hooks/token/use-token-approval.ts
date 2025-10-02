'use client'

import { useMutation } from '@tanstack/react-query'
import { approveToken } from '../../soroban/token-helpers'

export interface ApproveTokenParams {
  spender: string
  amount: bigint
  tokenAddress: string
}

export const useApproveToken = () => {
  return useMutation({
    mutationKey: ['token', 'approve'],
    mutationFn: async (params: ApproveTokenParams) => {
      return await approveToken(
        params.spender,
        params.amount,
        params.tokenAddress,
      )
    },
    onSuccess: () => {
      console.log('Token approval successful')
    },
    onError: (error) => {
      console.error('Failed to approve token:', error)
    },
  })
}
