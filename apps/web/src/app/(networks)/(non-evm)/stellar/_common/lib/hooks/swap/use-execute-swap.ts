'use client'

import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { toast } from 'react-toastify'
import { useStellarWallet } from '~stellar/providers'
import { SwapService } from '../../services/swap-service'
import type { Token } from '../../types/token.type'
import { extractErrorMessage } from '../../utils/error-helpers'
import { formatTokenAmountForDisplay } from '../../utils/format'
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
    mutationKey: ['stellar', 'swap', 'executeSwap'],
    onMutate: async (params: UseExecuteSwapParams) => {
      // Show "in progress" toast immediately before transaction starts
      const timestamp = Date.now()
      const infoToastId = `info:swap-${nanoid()}`
      const amountInFormatted = formatTokenAmountForDisplay(
        params.amountIn,
        params.tokenIn.decimals,
      )

      createInfoToast({
        summary: `Swapping ${amountInFormatted} ${params.tokenIn.code} for ${params.tokenOut.code}...`,
        type: 'swap',
        account: params.userAddress,
        chainId: 1,
        groupTimestamp: timestamp,
        timestamp,
        txHash: infoToastId, // Use as toast ID for dismissal
      })

      // Return context with toast ID for use in onError/onSuccess
      return { infoToastId }
    },
    mutationFn: async (params: UseExecuteSwapParams) => {
      const swapService = new SwapService()

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
          deadline: params.deadline || Math.floor(Date.now() / 1000) + 600,
        },
        signTransaction,
      )

      return { result, params }
    },
    onSuccess: ({ result, params }, _variables, context) => {
      // Dismiss the "in progress" info toast
      if (context?.infoToastId) {
        toast.dismiss(context.infoToastId)
      }

      const amountOut =
        result.amountOut < 0n ? -result.amountOut : result.amountOut
      const amountOutFormatted = formatTokenAmountForDisplay(
        amountOut,
        params.tokenOut.decimals,
      )
      const amountInFormatted = formatTokenAmountForDisplay(
        params.amountIn,
        params.tokenIn.decimals,
      )

      createSuccessToast({
        summary: `Swapped ${amountInFormatted} ${params.tokenIn.code} for ${amountOutFormatted} ${params.tokenOut.code}`,
        type: 'swap',
        account: params.userAddress,
        chainId: 1,
        txHash: result.txHash,
        href: getStellarTxnLink(result.txHash),
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })

      // Invalidate all stellar token balance queries to update balances after swap
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'token'],
      })
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'positions'],
      })
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'position-principals-batch'],
      })
    },
    onError: (error, _variables, context) => {
      // Dismiss the "in progress" info toast
      if (context?.infoToastId) {
        toast.dismiss(context.infoToastId)
      }

      const errorMessage = extractErrorMessage(error)
      console.error('Swap failed:', error)
      createErrorToast(errorMessage, false)
    },
  })
}

export interface UseExecuteMultiHopSwapParams {
  userAddress: string
  path: string[]
  fees: number[]
  amountIn: bigint
  amountOutMinimum: bigint
  recipient: string
  deadline?: number
  tokenIn?: Token
  tokenOut?: Token
}

export const useExecuteMultiHopSwap = () => {
  const { signTransaction } = useStellarWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['stellar', 'swap', 'executeMultiHopSwap'],
    onMutate: async (params: UseExecuteMultiHopSwapParams) => {
      // Show "in progress" toast immediately before transaction starts
      const timestamp = Date.now()
      const infoToastId = `info:multihop-swap-${nanoid()}`
      const tokenInDecimals = params.tokenIn?.decimals ?? 7
      const amountInFormatted = formatTokenAmountForDisplay(
        params.amountIn,
        tokenInDecimals,
      )

      createInfoToast({
        summary: `Swapping ${amountInFormatted} ${params.tokenIn?.code || 'tokens'} for ${params.tokenOut?.code || 'tokens'}...`,
        type: 'swap',
        account: params.userAddress,
        chainId: 1,
        groupTimestamp: timestamp,
        timestamp,
        txHash: infoToastId, // Use as toast ID for dismissal
      })

      // Return context with toast ID for use in onError/onSuccess
      return { infoToastId }
    },
    mutationFn: async (params: UseExecuteMultiHopSwapParams) => {
      const swapService = new SwapService()

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
    onSuccess: ({ result, params }, _variables, context) => {
      // Dismiss the "in progress" info toast
      if (context?.infoToastId) {
        toast.dismiss(context.infoToastId)
      }

      const amountOut =
        result.amountOut < 0n ? -result.amountOut : result.amountOut
      const tokenInDecimals = params.tokenIn?.decimals ?? 7
      const tokenOutDecimals = params.tokenOut?.decimals ?? 7
      const amountOutFormatted = formatTokenAmountForDisplay(
        amountOut,
        tokenOutDecimals,
      )
      const amountInFormatted = formatTokenAmountForDisplay(
        params.amountIn,
        tokenInDecimals,
      )

      createSuccessToast({
        summary: `Swapped ${amountInFormatted} ${params.tokenIn?.code || 'tokens'} for ${amountOutFormatted} ${params.tokenOut?.code || 'tokens'}`,
        type: 'swap',
        account: params.userAddress,
        chainId: 1,
        txHash: result.txHash,
        href: getStellarTxnLink(result.txHash),
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })

      // Invalidate all stellar token balance queries to update balances after swap
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'token'],
      })
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'positions'],
      })
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'position-principals-batch'],
      })
    },
    onError: (error, _variables, context) => {
      // Dismiss the "in progress" info toast
      if (context?.infoToastId) {
        toast.dismiss(context.infoToastId)
      }

      const errorMessage = extractErrorMessage(error)
      console.error('Multi-hop swap failed:', error)
      createErrorToast(errorMessage, false)
    },
  })
}
