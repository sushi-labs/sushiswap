'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStellarWallet } from '~stellar/providers'
import { SwapService } from '../../services/swap-service'
import type { Token } from '../../types/token.type'
import { getStellarTxnLink } from '../../utils/stellarchain-helpers'

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
  const queryClient = useQueryClient()

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

      return { result, params }
    },
    onSuccess: ({ result, params }) => {
      console.log('Swap executed successfully:', result)
      console.log('Transaction hash:', result.txHash)

      // Show success toast with Stellar explorer link
      const amountOut =
        result.amountOut < 0n ? -result.amountOut : result.amountOut
      const amountOutFormatted = (Number(amountOut) / 1e7).toFixed(4)
      const amountInFormatted = (Number(params.amountIn) / 1e7).toFixed(4)

      createToast({
        account: params.userAddress,
        type: 'swap',
        chainId: 1, // Stellar testnet
        txHash: result.txHash,
        href: getStellarTxnLink(result.txHash),
        promise: Promise.resolve(result),
        summary: {
          pending: `Swapping ${amountInFormatted} ${params.tokenIn.code} for ${params.tokenOut.code}`,
          completed: `Swapped ${amountInFormatted} ${params.tokenIn.code} for ${amountOutFormatted} ${params.tokenOut.code}`,
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

export const useExecuteMultiHopSwap = () => {
  const { signTransaction } = useStellarWallet()
  const queryClient = useQueryClient()

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
      tokenIn?: { code: string }
      tokenOut?: { code: string }
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

      return { result, params }
    },
    onSuccess: ({ result, params }) => {
      console.log('Multi-hop swap executed successfully:', result)
      console.log('Transaction hash:', result.txHash)

      // Show success toast
      const amountOut =
        result.amountOut < 0n ? -result.amountOut : result.amountOut
      const amountOutFormatted = (Number(amountOut) / 1e7).toFixed(4)
      const amountInFormatted = (Number(params.amountIn) / 1e7).toFixed(4)

      createToast({
        account: params.userAddress,
        type: 'swap',
        chainId: 1,
        txHash: result.txHash,
        href: getStellarTxnLink(result.txHash),
        promise: Promise.resolve(result),
        summary: {
          pending: `Swapping ${amountInFormatted} ${params.tokenIn?.code || 'tokens'} for ${params.tokenOut?.code || 'tokens'}`,
          completed: `Swapped ${amountInFormatted} ${params.tokenIn?.code || 'tokens'} for ${amountOutFormatted} ${params.tokenOut?.code || 'tokens'}`,
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
      console.error('Failed to execute multi-hop swap:', error)
      createErrorToast(
        error.message || 'Failed to execute multi-hop swap',
        false,
      )
    },
  })
}
