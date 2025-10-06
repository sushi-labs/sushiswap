'use client'

import { useMutation } from '@tanstack/react-query'
import { useStellarWallet } from '~stellar/providers'
import { SwapService } from '../../services/swap-service'
import type { Token } from '../../types/token.type'

export interface UseExecuteSwapParams {
  userAddress: string
  tokenIn: Token
  tokenOut: Token
  amountIn: bigint
  amountOutMinimum: bigint
  recipient: string
  deadline?: number
  sqrtPriceLimitX96?: bigint
  fee: number
}

export const useExecuteSwap = () => {
  const { signTransaction } = useStellarWallet()

  return useMutation({
    mutationKey: ['swap', 'executeSwap'],
    mutationFn: async (params: UseExecuteSwapParams) => {
      const swapService = new SwapService()

      // Execute single-hop swap using the swap service
      const result = await swapService.swapExactInputSingle(
        params.userAddress,
        {
          tokenIn: params.tokenIn.contract,
          tokenOut: params.tokenOut.contract,
          fee: params.fee,
          recipient: params.recipient,
          amountIn: params.amountIn,
          amountOutMinimum: params.amountOutMinimum,
          sqrtPriceLimitX96: params.sqrtPriceLimitX96,
          deadline: params.deadline || Math.floor(Date.now() / 1000) + 600, // 10 minutes default
        },
        signTransaction,
      )

      return result
    },
    onSuccess: (result) => {
      console.log('Swap executed successfully:', result)
      console.log('Transaction hash:', result.txHash)
    },
    onError: (error) => {
      console.error('Failed to execute swap:', error)
    },
  })
}

export const useExecuteMultiHopSwap = () => {
  const { signTransaction } = useStellarWallet()

  return useMutation({
    mutationKey: ['swap', 'executeMultiHopSwap'],
    mutationFn: async (params: {
      userAddress: string
      path: string[]
      fees: number[]
      amountIn: bigint
      amountOutMinimum: bigint
      recipient: string
      deadline?: number
    }) => {
      const swapService = new SwapService()

      // Execute multi-hop swap using the swap service
      const result = await swapService.swapExactInput(
        params.userAddress,
        {
          path: params.path,
          fees: params.fees,
          recipient: params.recipient,
          amountIn: params.amountIn,
          amountOutMinimum: params.amountOutMinimum,
          deadline: params.deadline || Math.floor(Date.now() / 1000) + 600,
        },
        signTransaction,
      )

      return result
    },
    onSuccess: (result) => {
      console.log('Multi-hop swap executed successfully:', result)
      console.log('Transaction hash:', result.txHash)
    },
    onError: (error) => {
      console.error('Failed to execute multi-hop swap:', error)
    },
  })
}
