'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeLiquidity } from '~stellar/_common/lib/soroban/pool-helpers'
import { useStellarWallet } from '~stellar/providers'

export interface RemovePoolLiquidityParams {
  address: string
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
  recipient: string
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

      return await removeLiquidity({
        ...params,
        sourceAccount: connectedAddress,
        signTransaction,
      })
    },
    onSuccess: (result, variables) => {
      console.log('Liquidity removed successfully:', result)

      // Show success toast
      createToast({
        account: connectedAddress || undefined,
        type: 'burn',
        chainId: 1, // Stellar testnet
        txHash: result.hash,
        promise: Promise.resolve(result),
        summary: {
          pending: 'Removing liquidity...',
          completed: 'Liquidity removed successfully',
          failed: 'Failed to remove liquidity',
        },
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })

      // Invalidate and refetch pool balances
      queryClient.invalidateQueries({
        queryKey: ['pool', 'balances', variables.address, connectedAddress],
      })

      // Invalidate pool info to refresh reserves
      queryClient.invalidateQueries({
        queryKey: ['pool', 'info', variables.address],
      })
    },
    onError: (error) => {
      console.error('Failed to remove liquidity:', error)
      createErrorToast(error.message || 'Failed to remove liquidity', false)
    },
  })
}
