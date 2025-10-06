'use client'

import { useMutation } from '@tanstack/react-query'
import { createSushiStellarService } from '../../services/sushi-stellar-service'
import type { AddLiquidityParams } from '../../services/swap-service'

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
    onSuccess: (result) => {
      console.log('Liquidity added successfully:', result)
    },
    onError: (error) => {
      console.error('Failed to add liquidity:', error)
    },
  })
}
