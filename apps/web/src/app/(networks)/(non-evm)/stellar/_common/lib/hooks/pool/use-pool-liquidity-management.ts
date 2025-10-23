'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  collectFees,
  decreaseLiquidity,
} from '~stellar/_common/lib/soroban/position-manager-helpers'
import { getStellarTxnLink } from '~stellar/_common/lib/utils/stellarchain-helpers'
import { useStellarWallet } from '~stellar/providers'

export interface RemovePoolLiquidityParams {
  tokenId: number
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
}

export const useRemoveLiquidity = () => {
  const { signTransaction, connectedAddress } = useStellarWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['pool', 'removeLiquidity'],
    mutationFn: async (params: RemovePoolLiquidityParams) => {
      if (!connectedAddress) {
        throw new Error('Wallet not connected')
      }

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 300) // 5 minutes

      // Step 1: Decrease liquidity (burns liquidity and adds principal + fees to tokens_owed)
      const decreaseResult = await decreaseLiquidity({
        tokenId: params.tokenId,
        liquidity: params.liquidity,
        amount0Min: params.amount0Min,
        amount1Min: params.amount1Min,
        deadline,
        operator: connectedAddress,
        sourceAccount: connectedAddress,
        signTransaction,
      })

      // Step 2: Collect the withdrawn tokens (principal + any accrued fees)
      // Pool's burn() adds amounts to tokens_owed but doesn't transfer
      // We must call collect() to actually receive the tokens
      const collectResult = await collectFees({
        tokenId: params.tokenId,
        recipient: connectedAddress,
        amount0Max: BigInt('18446744073709551615'), // uint128 max
        amount1Max: BigInt('18446744073709551615'), // uint128 max
        operator: connectedAddress,
        signTransaction,
      })

      return {
        decreaseHash: decreaseResult.hash,
        collectHash: collectResult.txHash,
        amount0: collectResult.amount0,
        amount1: collectResult.amount1,
      }
    },
    onSuccess: (result, variables) => {
      console.log('Liquidity removed and collected successfully:', result)
      console.log(`  Decrease tx: ${result.decreaseHash}`)
      console.log(`  Collect tx: ${result.collectHash}`)
      console.log(
        `  Received: ${result.amount0} token0, ${result.amount1} token1`,
      )

      // Format amounts for better display
      const formatAmount = (amount: bigint) => {
        const num = Number(amount) / 1e7 // Convert from Stellar's 7 decimal places
        return num.toFixed(4)
      }

      // Show success toast with collect transaction link (the one that transfers tokens)
      createToast({
        account: connectedAddress || undefined,
        type: 'burn',
        chainId: 1, // Stellar testnet
        txHash: result.collectHash,
        href: getStellarTxnLink(result.collectHash),
        promise: Promise.resolve(result),
        summary: {
          pending: `Removing liquidity and collecting ${formatAmount(result.amount0)} token0, ${formatAmount(result.amount1)} token1...`,
          completed: `Liquidity removed! Collected ${formatAmount(result.amount0)} token0, ${formatAmount(result.amount1)} token1`,
          failed: 'Failed to remove liquidity',
        },
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })

      // Invalidate position queries to refresh position data
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'positions', 'user', connectedAddress],
      })

      // Invalidate position-pool queries used by useMyPosition
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'position-pool'],
      })

      // Invalidate position-principals-batch queries used by useMyPosition
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'position-principals-batch'],
      })

      // Invalidate the specific position
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'positions', 'token', variables.tokenId],
      })

      // Invalidate position principal for this specific token
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'position-principal', variables.tokenId],
      })

      // Invalidate pool info to refresh reserves
      queryClient.invalidateQueries({
        queryKey: ['pool', 'info'],
      })

      // Invalidate pool balances
      queryClient.invalidateQueries({
        queryKey: ['pool', 'balances'],
      })
    },
    onError: (error) => {
      console.error('Failed to remove liquidity:', error)
      createErrorToast(error.message || 'Failed to remove liquidity', false)
    },
  })
}
