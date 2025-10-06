'use client'

import { useMutation } from '@tanstack/react-query'
import { executeSwap } from '../../soroban/dex-router-helpers'

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

export const useRouterExecuteSwap = () => {
  return useMutation({
    mutationKey: ['router', 'executeSwap'],
    mutationFn: async (params: ExecuteSwapParams) => {
      return await executeSwap(params)
    },
    onSuccess: (result) => {
      console.log('Swap executed successfully:', result)
    },
    onError: (error) => {
      console.error('Failed to execute swap:', error)
    },
  })
}
