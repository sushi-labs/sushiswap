'use client'

import { createErrorToast } from '@sushiswap/notifications'
import { useMutation } from '@tanstack/react-query'

export interface ExecuteSwapParams {
  amountIn: bigint
  amountOutMinimum: bigint
  deadline: number
  fee: number
  recipient: string
  sender: string
  sqrtPriceLimitX96: bigint
  tokenIn: string
  tokenOut: string
}

// This hook is deprecated - use useExecuteSwap from hooks/swap instead
export const useRouterExecuteSwap = () => {
  return useMutation({
    mutationKey: ['stellar', 'router', 'executeSwap'],
    mutationFn: async (_params: ExecuteSwapParams) => {
      throw new Error(
        'This hook is deprecated. Use useExecuteSwap from hooks/swap instead.',
      )
    },
    onSuccess: () => {
      // This will never be called since we throw an error
    },
    onError: (error) => {
      console.error('Deprecated hook called:', error)
      createErrorToast(
        'This swap method is deprecated. Please refresh the page.',
        false,
      )
    },
  })
}
