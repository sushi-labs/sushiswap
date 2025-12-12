'use client'

import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSushiStellarService } from '../../services/sushi-stellar-service'
import type { Token } from '../../types/token.type'
import { extractErrorMessage } from '../../utils/error-helpers'
import { formatTokenAmountWithDecimals } from '../../utils/format'
import { getStellarTxnLink } from '../../utils/stellarchain-helpers'

export interface UseZapParams {
  poolAddress: string
  tokenIn: Token
  amountIn: string
  tokenInDecimals: number
  token0: Token
  token1: Token
  tickLower: number
  tickUpper: number
  slippage?: number
  userAddress: string
  signTransaction: (xdr: string) => Promise<string>
  signAuthEntry: (entryPreimageXdr: string) => Promise<string>
}

export const useZap = () => {
  const service = createSushiStellarService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['zap'],
    onMutate: async (params: UseZapParams) => {
      const timestamp = Date.now()
      createInfoToast({
        summary: 'Adding Liquidity...',
        type: 'mint',
        account: params.userAddress,
        chainId: 1, // Stellar doesn't have chainId like EVM, using 1 as placeholder or generic
        groupTimestamp: timestamp,
        timestamp,
      })
    },
    mutationFn: async (params: UseZapParams) => {
      const {
        poolAddress,
        tokenIn,
        amountIn,
        tokenInDecimals,
        token0,
        token1,
        tickLower,
        tickUpper,
        slippage = 0.005,
        userAddress,
        signTransaction,
        signAuthEntry,
      } = params

      const amountInBigInt = BigInt(
        Math.floor(Number.parseFloat(amountIn) * 10 ** tokenInDecimals),
      )

      // Determine if tokenIn is token0, token1, or external
      const isToken0 = tokenIn.contract === token0.contract
      const isToken1 = tokenIn.contract === token1.contract
      const isExternalToken = !isToken0 && !isToken1

      let currentToken0Balance = 0n
      let currentToken1Balance = 0n

      if (isExternalToken) {
        // Case: External token - swap entire amount to get 50/50 of both pool tokens
        // Split the input amount in half and swap each half to token0 and token1
        const halfAmount = amountInBigInt / 2n
        const remainingAmount = amountInBigInt - halfAmount // Handle odd amounts

        // Swap first half to token0
        const swapToToken0Result = await service.swapWithRouting(
          userAddress,
          tokenIn,
          token0,
          halfAmount,
          signTransaction,
          slippage,
        )
        currentToken0Balance = swapToToken0Result.amountOut

        // Add delay between swaps
        await new Promise((resolve) => setTimeout(resolve, 8000))

        // Swap remaining amount to token1
        const swapToToken1Result = await service.swapWithRouting(
          userAddress,
          tokenIn,
          token1,
          remainingAmount,
          signTransaction,
          slippage,
        )
        currentToken1Balance = swapToToken1Result.amountOut

        // Add delay to ensure Stellar nodes have fully processed the swap transactions
        await new Promise((resolve) => setTimeout(resolve, 8000))

        // Invalidate balances to reflect swaps in UI
        queryClient.invalidateQueries({ queryKey: ['pool', 'balances'] })
        queryClient.invalidateQueries({ queryKey: ['pool', 'info'] })

        console.log(
          'Swaps completed for external token, waiting for network state to update...',
        )
      } else {
        // Case: tokenIn is one of the pool tokens - swap 50% to the other token
        const halfAmount = amountInBigInt / 2n
        const remainingAmount = amountInBigInt - halfAmount

        // Set initial balances
        if (isToken0) {
          currentToken0Balance = remainingAmount
          currentToken1Balance = 0n
        } else {
          currentToken0Balance = 0n
          currentToken1Balance = remainingAmount
        }

        // Swap half to the other pool token
        const swapTokenOut = isToken0 ? token1 : token0
        const swapResult = await service.swapWithRouting(
          userAddress,
          tokenIn,
          swapTokenOut,
          halfAmount,
          signTransaction,
          slippage,
        )

        // Update balances after swap
        if (isToken0) {
          // We swapped Token 0 -> Token 1
          currentToken1Balance = swapResult.amountOut
        } else {
          // We swapped Token 1 -> Token 0
          currentToken0Balance = swapResult.amountOut
        }

        // Add delay to ensure Stellar nodes have fully processed the swap transaction
        await new Promise((resolve) => setTimeout(resolve, 8000))

        // Invalidate balances to reflect swap in UI immediately (before add liquidity)
        queryClient.invalidateQueries({ queryKey: ['pool', 'balances'] })
        queryClient.invalidateQueries({ queryKey: ['pool', 'info'] })

        console.log(
          'Swap completed, waiting for network state to update...',
          swapResult.txHash,
        )
      }

      // 3. Add Liquidity
      // We use the remaining balances

      // Format back to string for addLiquidity params
      const token0AmountStr = formatTokenAmountWithDecimals(
        currentToken0Balance,
        token0.decimals,
      )
      const token1AmountStr = formatTokenAmountWithDecimals(
        currentToken1Balance,
        token1.decimals,
      )

      const addLiqResult = await service.addLiquidity(
        userAddress,
        {
          poolAddress,
          token0Amount: token0AmountStr,
          token1Amount: token1AmountStr,
          token0Decimals: token0.decimals,
          token1Decimals: token1.decimals,
          tickLower,
          tickUpper,
          recipient: userAddress,
        },
        signTransaction,
        signAuthEntry,
      )

      return { addLiqResult, params }
    },
    onSuccess: ({ addLiqResult, params }) => {
      createSuccessToast({
        summary: 'Liquidity added successfully',
        type: 'mint',
        account: params.userAddress,
        chainId: 1,
        txHash: addLiqResult.txHash,
        href: getStellarTxnLink(addLiqResult.txHash),
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['pool', 'balances'] })
      queryClient.invalidateQueries({ queryKey: ['pool', 'info'] })
      queryClient.invalidateQueries({ queryKey: ['stellar', 'positions'] })
      queryClient.invalidateQueries({ queryKey: ['stellar', 'position-pool'] })
    },
    onError: (error) => {
      console.error('Add liquidity failed:', error)
      const errorMessage = extractErrorMessage(error)
      createErrorToast(errorMessage, false)
    },
  })
}
