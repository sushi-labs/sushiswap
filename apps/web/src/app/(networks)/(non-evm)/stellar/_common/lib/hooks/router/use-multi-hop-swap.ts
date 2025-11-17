'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStellarWallet } from '~stellar/providers'
import { SwapService } from '../../services/swap-service'
import type { Token } from '../../types/token.type'
import { formatTokenAmountForDisplay } from '../../utils/format'
import { getStellarTxnLink } from '../../utils/stellarchain-helpers'

export interface MultiHopSwapExactInputParams {
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

export const useExecuteSwapExactInputMulti = () => {
  const { signTransaction } = useStellarWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['router', 'executeSwapExactInputMulti'],
    mutationFn: async (params: MultiHopSwapExactInputParams) => {
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
          deadline: params.deadline || Math.floor(Date.now() / 1000) + 600, // 10 minutes default
        },
        signTransaction,
      )

      return { result, params }
    },
    onSuccess: ({ result, params }) => {
      // Show success toast with Stellar explorer link
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

      createToast({
        account: params.userAddress,
        type: 'swap',
        chainId: 1, // Stellar testnet
        txHash: result.txHash,
        href: getStellarTxnLink(result.txHash),
        promise: Promise.resolve(result),
        summary: {
          pending: `Swapping ${amountInFormatted} ${params.tokenIn?.code || 'tokens'} for ${params.tokenOut?.code || 'tokens'}`,
          completed: `Swapped ${amountInFormatted} ${params.tokenIn?.code || 'tokens'} for ${amountOutFormatted} ${params.tokenOut?.code || 'tokens'}`,
          failed: 'Multi-hop swap failed',
        },
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })

      // Invalidate token balances and positions after swap
      queryClient.invalidateQueries({
        queryKey: ['token', 'balance'],
      })
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'positions'],
      })
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'position-principals-batch'],
      })
    },
    onError: (error) => {
      createErrorToast(
        error.message || 'Failed to execute multi-hop exact input swap',
        false,
      )
    },
  })
}
