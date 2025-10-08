'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSushiStellarService } from '../../services/sushi-stellar-service'
import type { AddLiquidityParams } from '../../services/swap-service'
import { getStellarTxnLink } from '../../utils/stellarchain-helpers'

export interface UseAddLiquidityParams {
  userAddress: string
  poolAddress: string
  token0Amount: string
  token1Amount: string
  tickLower: number
  tickUpper: number
  recipient?: string
  deadline?: number
}

export const useAddLiquidity = () => {
  const service = createSushiStellarService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['swap', 'addLiquidity'],
    mutationFn: async (params: UseAddLiquidityParams) => {
      const addLiquidityParams: AddLiquidityParams = {
        poolAddress: params.poolAddress,
        token0Amount: params.token0Amount,
        token1Amount: params.token1Amount,
        tickLower: params.tickLower,
        tickUpper: params.tickUpper,
        recipient: params.recipient || params.userAddress,
        deadline: params.deadline || Math.floor(Date.now() / 1000) + 300,
      }

      return await service.addLiquidity(params.userAddress, addLiquidityParams)
    },
    onSuccess: (result, variables) => {
      console.log('Liquidity added successfully:', result)

      // Show success toast with Stellar explorer link
      createToast({
        account: variables.userAddress || undefined,
        type: 'mint',
        chainId: 1, // Stellar testnet
        txHash: result.txHash,
        href: getStellarTxnLink(result.txHash),
        promise: Promise.resolve(result),
        summary: {
          pending: 'Adding liquidity...',
          completed: 'Liquidity added successfully',
          failed: 'Failed to add liquidity',
        },
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })

      // Invalidate and refetch pool balances
      queryClient.invalidateQueries({
        queryKey: [
          'pool',
          'balances',
          variables.poolAddress,
          variables.userAddress,
        ],
      })

      // Invalidate pool info to refresh reserves
      queryClient.invalidateQueries({
        queryKey: ['pool', 'info', variables.poolAddress],
      })
    },
    onError: (error) => {
      console.error('Failed to add liquidity:', error)
      createErrorToast(error.message || 'Failed to add liquidity', false)
    },
  })
}
