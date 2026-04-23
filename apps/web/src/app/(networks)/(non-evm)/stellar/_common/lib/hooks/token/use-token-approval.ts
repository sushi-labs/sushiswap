'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { StellarAddress, StellarContractAddress } from 'sushi/stellar'
import { approveToken } from '../../soroban/token-helpers'

export interface ApproveTokenParams {
  spender: StellarAddress
  amount: bigint
  tokenAddress: StellarContractAddress
}

export const useApproveToken = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['stellar', 'token', 'approve'],
    mutationFn: async (params: ApproveTokenParams) => {
      return await approveToken(
        params.spender,
        params.amount,
        params.tokenAddress,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'token', 'allowance'],
      })
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'token', 'multipleAllowances'],
      })
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'token', 'hasSufficientAllowance'],
      })
    },
    onError: (error) => {
      console.error('Failed to approve token:', error)
    },
  })
}
