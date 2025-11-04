'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useStellarWallet } from '~stellar/providers'
import { createPool } from '../../soroban/dex-factory-helpers'
import { getStellarTxnLink } from '../../utils/stellarchain-helpers'

export interface CreatePoolParams {
  tokenA: string
  tokenB: string
  tokenAmountA: string
  tokenAmountB: string
  fee: number
}

export const useCreatePool = () => {
  const { signTransaction, connectedAddress } = useStellarWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['factory', 'createPool'],
    mutationFn: async (params: CreatePoolParams) => {
      if (!connectedAddress) {
        throw new Error('Wallet not connected')
      }

      return await createPool({
        ...params,
        sourceAccount: connectedAddress,
        signTransaction,
      })
    },
    onSuccess: (result) => {
      // Show success toast with Stellar explorer link
      createToast({
        account: connectedAddress || undefined,
        type: 'swap',
        chainId: 1, // Stellar testnet
        txHash: result.txHash,
        href: getStellarTxnLink(result.txHash),
        promise: Promise.resolve(result),
        summary: {
          pending: 'Creating pool...',
          completed: `Pool created successfully at ${result.poolAddress.substring(0, 8)}...`,
          failed: 'Failed to create pool',
        },
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })

      // Invalidate pools list
      queryClient.invalidateQueries({
        queryKey: ['pool', 'allPools'],
      })
    },
    onError: (error) => {
      console.error('Failed to create pool:', error)
      createErrorToast(error.message || 'Failed to create pool', false)
    },
  })
}
