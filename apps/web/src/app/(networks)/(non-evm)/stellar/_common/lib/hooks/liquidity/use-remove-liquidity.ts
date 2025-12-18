'use client'

import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { decreaseLiquidity } from '~stellar/_common/lib/soroban/position-manager-helpers'
import { getStellarTxnLink } from '~stellar/_common/lib/utils/stellarchain-helpers'
import { useStellarWallet } from '~stellar/providers'

export interface RemovePoolLiquidityParams {
  tokenId: number
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
  token0Code: string
  token1Code: string
}

export const useRemoveLiquidity = () => {
  const { signTransaction, signAuthEntry, connectedAddress } =
    useStellarWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['pool', 'removeLiquidity'],
    onMutate: async () => {
      // Show "in progress" toast immediately before transaction starts
      const timestamp = Date.now()
      if (connectedAddress) {
        createInfoToast({
          summary: 'Removing liquidity...',
          type: 'burn',
          account: connectedAddress,
          chainId: 1,
          groupTimestamp: timestamp,
          timestamp,
        })
      }
    },
    mutationFn: async (params: RemovePoolLiquidityParams) => {
      if (!connectedAddress) {
        throw new Error('Wallet not connected')
      }

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 300)

      const decreaseResult = await decreaseLiquidity({
        tokenId: params.tokenId,
        liquidity: params.liquidity,
        amount0Min: params.amount0Min,
        amount1Min: params.amount1Min,
        deadline,
        operator: connectedAddress,
        sourceAccount: connectedAddress,
        signTransaction,
        signAuthEntry,
      })

      return {
        decreaseHash: decreaseResult.hash,
      }
    },
    onSuccess: (result, variables) => {
      createSuccessToast({
        summary: `Liquidity removed!`,
        type: 'burn',
        account: connectedAddress || undefined,
        chainId: 1,
        txHash: result.decreaseHash,
        href: getStellarTxnLink(result.decreaseHash),
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })

      queryClient.invalidateQueries({
        queryKey: ['stellar', 'positions', 'user', connectedAddress],
      })

      queryClient.invalidateQueries({
        queryKey: ['stellar', 'position-pool'],
      })

      queryClient.invalidateQueries({
        queryKey: ['stellar', 'position-principals-batch'],
      })

      queryClient.invalidateQueries({
        queryKey: ['stellar', 'positions', 'token', variables.tokenId],
      })

      queryClient.invalidateQueries({
        queryKey: ['stellar', 'position-principal', variables.tokenId],
      })

      queryClient.invalidateQueries({
        queryKey: ['pool', 'info'],
      })

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
