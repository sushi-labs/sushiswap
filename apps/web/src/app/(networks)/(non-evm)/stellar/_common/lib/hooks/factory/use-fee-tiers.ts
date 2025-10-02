'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { enableFeeAmount, getFeeTiers } from '../../soroban/dex-factory-helpers'

export const useFeeTiers = () => {
  return useQuery({
    queryKey: ['factory', 'feeTiers'],
    queryFn: async () => {
      return await getFeeTiers()
    },
  })
}

export const useEnableFeeAmount = () => {
  return useMutation({
    mutationKey: ['factory', 'enableFeeAmount'],
    mutationFn: async (params: { fee: number; tickSpacing: number }) => {
      return await enableFeeAmount(params)
    },
    onSuccess: () => {
      console.log('Fee amount enabled successfully')
    },
    onError: (error) => {
      console.error('Failed to enable fee amount:', error)
    },
  })
}
