'use client'

import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChainId } from 'sushi'
import { createAndInitializePool } from '../../soroban/dex-factory-helpers'
import { formatAddress } from '../../utils/format'
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
    mutationKey: ['stellar', 'factory', 'createAndInitializePool'],
    onMutate: async (params: CreateAndInitializePoolParams) => {
      const timestamp = Date.now()
      createInfoToast({
        summary: 'Creating/initializing pool...',
        type: 'swap',
        account: params.userAddress,
        chainId: ChainId.STELLAR,
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
      const timestamp = Date.now()
      createSuccessToast({
        summary: `Initialized pool ${result.txHash !== undefined ? 'created successfully' : 'already exists'} at ${formatAddress(result.poolAddress)}...`,
        type: 'swap',
        account: variables.userAddress,
        chainId: ChainId.STELLAR,
        txHash: result.txHash,
        href: result.txHash && getStellarTxnLink(result.txHash),
        groupTimestamp: timestamp,
        timestamp,
      })

      // Invalidate pools list
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'pool', 'allPools'],
      })
      invalidatePoolInitializedQuery(queryClient, result.poolAddress)
    },
    onError: (error) => {
      console.error('Failed to create pool:', error)
      createErrorToast(error.message || 'Failed to create pool', false)
    },
  })
}
