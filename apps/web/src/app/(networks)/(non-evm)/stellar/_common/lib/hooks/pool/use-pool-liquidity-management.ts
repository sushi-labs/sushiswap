'use client'

import { useMutation } from '@tanstack/react-query'
import {
  addLiquidity,
  collectFees,
  removeLiquidity,
} from '~stellar/_common/lib/soroban/pool-helpers'

export interface AddPoolLiquidityParams {
  address: string
  recipient: string
  tickLower: number
  tickUpper: number
  amount: bigint
}

export interface RemovePoolLiquidityParams {
  address: string
  tokenId: bigint
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
  recipient: string
}

export interface CollectPoolFeesParams {
  address: string
  tokenId: bigint
  amount0Max: bigint
  amount1Max: bigint
  recipient: string
}

export const useAddLiquidity = () => {
  return useMutation({
    mutationKey: ['pool', 'addLiquidity'],
    mutationFn: async (params: AddPoolLiquidityParams) => {
      return await addLiquidity(params)
    },
    onSuccess: (result) => {
      console.log('Liquidity added successfully:', result)
    },
    onError: (error) => {
      console.error('Failed to add liquidity:', error)
    },
  })
}

export const useRemoveLiquidity = () => {
  return useMutation({
    mutationKey: ['pool', 'removeLiquidity'],
    mutationFn: async (params: RemovePoolLiquidityParams) => {
      return await removeLiquidity(params)
    },
    onSuccess: (result) => {
      console.log('Liquidity removed successfully:', result)
    },
    onError: (error) => {
      console.error('Failed to remove liquidity:', error)
    },
  })
}

export const useCollectFees = () => {
  return useMutation({
    mutationKey: ['pool', 'collectFees'],
    mutationFn: async (params: CollectPoolFeesParams) => {
      return await collectFees(params)
    },
    onSuccess: (result) => {
      console.log('Fees collected successfully:', result)
    },
    onError: (error) => {
      console.error('Failed to collect fees:', error)
    },
  })
}
