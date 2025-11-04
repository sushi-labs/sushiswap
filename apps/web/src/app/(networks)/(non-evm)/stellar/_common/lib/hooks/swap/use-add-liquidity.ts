'use client'

import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSushiStellarService } from '../../services/sushi-stellar-service'
import type { AddLiquidityParams } from '../../services/swap-service'
import { extractErrorMessage } from '../../utils/error-helpers'
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
  signTransaction: (xdr: string) => Promise<string>
}

export const useAddLiquidity = () => {
  const service = createSushiStellarService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['swap', 'addLiquidity'],
    onMutate: async (params: UseAddLiquidityParams) => {
      // Show "in progress" toast immediately before transaction starts
      const timestamp = Date.now()
      createInfoToast({
        summary: 'Adding liquidity...',
        type: 'mint',
        account: params.userAddress,
        chainId: 1,
        groupTimestamp: timestamp,
        timestamp,
      })
    },
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

      const result = await service.addLiquidity(
        params.userAddress,
        addLiquidityParams,
        params.signTransaction,
      )

      return { result, params }
    },
    onSuccess: ({ result, params: variables }) => {
      createSuccessToast({
        summary: 'Liquidity added successfully',
        type: 'mint',
        account: variables.userAddress,
        chainId: 1,
        txHash: result.txHash,
        href: getStellarTxnLink(result.txHash),
        groupTimestamp: Date.now(),
        timestamp: Date.now(),
      })

      queryClient.invalidateQueries({
        queryKey: [
          'pool',
          'balances',
          variables.poolAddress,
          variables.userAddress,
        ],
      })

      queryClient.invalidateQueries({
        queryKey: ['pool', 'info', variables.poolAddress],
      })

      queryClient.invalidateQueries({
        queryKey: ['stellar', 'positions', 'user', variables.userAddress],
      })

      queryClient.invalidateQueries({
        queryKey: ['stellar', 'position-pool'],
      })

      queryClient.invalidateQueries({
        queryKey: ['stellar', 'position-principals-batch'],
      })

      if (result.tokenId) {
        queryClient.invalidateQueries({
          queryKey: ['stellar', 'positions', 'token', result.tokenId],
        })
        queryClient.invalidateQueries({
          queryKey: ['stellar', 'position-principal', result.tokenId],
        })
      }
    },
    onError: (error) => {
      console.error('Failed to add liquidity:', error)
      const errorMessage = extractErrorMessage(error)
      createErrorToast(errorMessage, false)
    },
  })
}
