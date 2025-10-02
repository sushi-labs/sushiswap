'use client'

import { useMutation } from '@tanstack/react-query'
import { createPool } from '../../soroban/dex-factory-helpers'

export interface CreatePoolParams {
  tokenA: string
  tokenB: string
  fee: number
}

export const useCreatePool = () => {
  return useMutation({
    mutationKey: ['factory', 'createPool'],
    mutationFn: async (params: CreatePoolParams) => {
      return await createPool(params)
    },
    onSuccess: (poolAddress) => {
      console.log('Pool created successfully:', poolAddress)
    },
    onError: (error) => {
      console.error('Failed to create pool:', error)
    },
  })
}
