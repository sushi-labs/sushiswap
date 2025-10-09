'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { executeSwap } from '../../soroban/dex-router-helpers'
import { getStellarTxnLink } from '../../utils/stellarchain-helpers'

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
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['router', 'executeSwap'],
    mutationFn: async (params: ExecuteSwapParams) => {
      const result = await executeSwap(params)
      return { result, params }
    },
    onSuccess: ({ result, params }) => {
      console.log('Swap executed successfully:', result)

      // Show success toast
      const amountInFormatted = (Number(params.amountIn) / 1e7).toFixed(4)
      const amountOut = result.amountOut < 0n ? -result.amountOut : result.amountOut
      const amountOutFormatted = (Number(amountOut) / 1e7).toFixed(4)

      createToast({
        account: params.sender,
        type: 'swap',
        chainId: 1,
        promise: Promise.resolve(result),
        summary: {
          pending: `Swapping ${amountInFormatted} tokens`,
          completed: `Swapped ${amountInFormatted} for ${amountOutFormatted} tokens`,
          failed: 'Swap failed',
        },
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })

      // Invalidate token balances
      queryClient.invalidateQueries({
        queryKey: ['token', 'balance'],
      })
    },
    onError: (error) => {
      console.error('Failed to execute swap:', error)
      createErrorToast(error.message || 'Failed to execute swap', false)
    },
  })
}
