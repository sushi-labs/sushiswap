'use client'

import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSushiStellarService } from '../../services/sushi-stellar-service'
import {
  calculateAmountsFromLiquidity,
  calculateLiquidityFromAmount0,
  getCurrentSqrtPrice,
  tickToSqrtPrice,
} from '../../soroban/pool-helpers'
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
      } = params

      // 1. Get Pool State
      const currentSqrtPriceX96 = await getCurrentSqrtPrice(poolAddress)
      const sqrtPriceLowerX96 = tickToSqrtPrice(tickLower)
      const sqrtPriceUpperX96 = tickToSqrtPrice(tickUpper)

      const amountInBigInt = BigInt(
        Math.floor(Number.parseFloat(amountIn) * 10 ** tokenInDecimals),
      )

      // Determine if tokenIn is token0 or token1
      const isToken0 = tokenIn.contract === token0.contract

      let amountToSwap = 0n
      let isSwapNeeded = false
      const swapTokenIn = tokenIn
      const swapTokenOut = isToken0 ? token1 : token0

      // Logic to determine swap amount
      if (currentSqrtPriceX96 < sqrtPriceLowerX96) {
        // Price is below range
        // If tokenIn is token0: We need only token0. No swap needed.
        // If tokenIn is token1: We need only token0. Swap ALL token1 to token0.
        if (!isToken0) {
          isSwapNeeded = true
          amountToSwap = amountInBigInt
        }
      } else if (currentSqrtPriceX96 >= sqrtPriceUpperX96) {
        // Price is above range
        // If tokenIn is token0: We need only token1. Swap ALL token0 to token1.
        // If tokenIn is token1: We need only token1. No swap needed.
        if (isToken0) {
          isSwapNeeded = true
          amountToSwap = amountInBigInt
        }
      } else {
        // Price is within range. We need both tokens.
        // Calculate optimal swap amount.

        // Calculate Ratio = amount1 / amount0 required for liquidity
        // We use a dummy large amount of liquidity to get precise ratio
        // Or simpler: calculate amounts for 1 unit of token0 (scaled)

        const dummyAmount0 = BigInt(10 ** token0.decimals) // 1 unit
        const liquidity = calculateLiquidityFromAmount0(
          dummyAmount0,
          currentSqrtPriceX96,
          sqrtPriceLowerX96,
          sqrtPriceUpperX96,
        )
        const amounts = calculateAmountsFromLiquidity(
          liquidity,
          currentSqrtPriceX96,
          sqrtPriceLowerX96,
          sqrtPriceUpperX96,
        )

        // Ratio R = amount1 / amount0
        const ratioNum = Number(amounts.amount1) / Number(amounts.amount0) // Watch out for precision
        // Using Number might lose precision for very large/small ratios but ok for estimation.
        // Better:
        // If isToken0 (we have A, need B):
        // Swap S of A to B.
        // (A - S) / B_out = 1 / Ratio  => (A - S) * Ratio = B_out
        // B_out approx S * Price * (1-fee)
        // Ratio * A - Ratio * S = S * Price * (1-fee)
        // S = (Ratio * A) / (Price * (1-fee) + Ratio)

        // If !isToken0 (we have B, need A):
        // Swap S of B to A.
        // A_out / (B - S) = 1 / Ratio
        // A_out = Ratio * (B - S)
        // A_out approx S * (1/Price) * (1-fee)
        // S * (1/Price) * (1-fee) = Ratio * B - Ratio * S
        // S * ( (1-fee)/Price + Ratio ) = Ratio * B
        // S = (Ratio * B) / (Ratio + (1-fee)/Price)

        // Price (token1/token0)
        const price = Number(currentSqrtPriceX96) ** 2 / 2 ** (96 * 2)
        // We need to adjust price for decimals difference between 0 and 1?
        // currentSqrtPriceX96 is based on raw units.
        // amounts.amount1 and amounts.amount0 are raw units.
        // So ratioNum is raw ratio.
        // price is also raw price (y/x).

        // Current price from sqrtPriceX96 is consistent with amounts.

        const fee = 0.003 // Assume 0.3% for standard pool, but should check pool.fee
        // For now use 0.003 as estimate.

        if (isToken0) {
          // S = (Ratio * A) / (Price * (1-fee) + Ratio)
          const numerator = ratioNum * Number(amountInBigInt)
          const denominator = price * (1 - fee) + ratioNum
          amountToSwap = BigInt(Math.floor(numerator / denominator))
        } else {
          // S = (B * Price) / (Price + Ratio * (1-fee))
          const numerator = Number(amountInBigInt) * price
          const denominator = price + ratioNum * (1 - fee)
          amountToSwap = BigInt(Math.floor(numerator / denominator))
        }

        isSwapNeeded = amountToSwap > 0n
      }

      let currentToken0Balance = isToken0 ? amountInBigInt : 0n
      let currentToken1Balance = !isToken0 ? amountInBigInt : 0n

      // 2. Execute Swap if needed
      if (isSwapNeeded && amountToSwap > 0n) {
        // Update balances before swap (deduct swap amount)
        if (isToken0) {
          currentToken0Balance -= amountToSwap
        } else {
          currentToken1Balance -= amountToSwap
        }

        const swapResult = await service.swapWithRouting(
          userAddress,
          swapTokenIn,
          swapTokenOut,
          amountToSwap,
          signTransaction,
          slippage,
        )

        // Wait for transaction? swapWithRouting already waits.

        // Update balances after swap
        if (isToken0) {
          // We swapped Token 0 -> Token 1
          // currentToken0Balance (remaining) is already updated
          // We received Token 1
          currentToken1Balance = swapResult.amountOut // Set precise amount from swap
        } else {
          // We swapped Token 1 -> Token 0
          // currentToken1Balance (remaining) is already updated
          // We received Token 0
          currentToken0Balance = swapResult.amountOut // Set precise amount from swap
        }

        // Add delay to ensure Stellar nodes have fully processed the swap transaction
        // This is similar to the delay needed after pool creation/initialization
        // Increased delay to ensure pool state is fully updated before adding liquidity
        await new Promise((resolve) => setTimeout(resolve, 8000))

        // Invalidate balances to reflect swap in UI immediately (before add liquidity)
        queryClient.invalidateQueries({ queryKey: ['pool', 'balances'] })
        queryClient.invalidateQueries({ queryKey: ['pool', 'info'] })

        // Optional: Show toast for swap completion?
        // Or just proceed to add liquidity.
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
