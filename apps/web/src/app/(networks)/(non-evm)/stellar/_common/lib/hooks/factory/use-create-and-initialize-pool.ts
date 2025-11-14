'use client'

import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAndInitializePool } from '../../soroban/dex-factory-helpers'
import { getStellarTxnLink } from '../../utils/stellarchain-helpers'
import { invalidatePoolInitializedQuery } from '../pool/use-pool-initialized'

export interface CreateAndInitializePoolParams {
  userAddress: string
  tokenA: string
  tokenB: string
  fee: number
  sqrtPriceX96: bigint
  signTransaction: (xdr: string) => Promise<string>
}

export const useCreateAndInitializePool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['factory', 'createAndInitializePool'],
    onMutate: async (params: CreateAndInitializePoolParams) => {
      const timestamp = Date.now()
      createInfoToast({
        summary: 'Creating/initializing pool...',
        type: 'swap',
        account: params.userAddress,
        chainId: 1,
        groupTimestamp: timestamp,
        timestamp,
      })
    },
    mutationFn: async (params: CreateAndInitializePoolParams) => {
      const result = await createAndInitializePool({
        ...params,
        sourceAccount: params.userAddress,
        signTransaction: params.signTransaction,
      })
      return {
        result,
        params,
      }
    },
    onSuccess: ({ result, params: variables }) => {
      // Show success toast with Stellar explorer link
      createSuccessToast({
        summary: `Initialized pool ${result.txHash !== undefined ? 'created successfully' : 'already exists'} at ${result.poolAddress.substring(0, 8)}...`,
        type: 'swap',
        account: variables.userAddress,
        chainId: 1, // Stellar testnet
        txHash: 'create_and_initialize_pool',
        href: result.txHash && getStellarTxnLink(result.txHash),
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })

      // Invalidate pools list
      queryClient.invalidateQueries({
        queryKey: ['pool', 'allPools'],
      })
      invalidatePoolInitializedQuery(queryClient, result.poolAddress)
    },
    onError: (error) => {
      console.error('Failed to create pool:', error)
      createErrorToast(error.message || 'Failed to create pool', false)
    },
  })
}
