'use client'

import { useMutation } from '@tanstack/react-query'
import {
  executeSwapExactInputMulti,
  executeSwapExactOutputMulti,
} from '../../soroban/dex-router-helpers'

export interface MultiHopSwapExactInputParams {
  amountIn: bigint
  amountOutMinimum: bigint
  deadline: number
  fees: number[]
  path: string[]
  recipient: string
  sender: string
}

export interface MultiHopSwapExactOutputParams {
  amountInMaximum: bigint
  amountOut: bigint
  deadline: number
  fees: number[]
  path: string[]
  recipient: string
  sender: string
}

export const useExecuteSwapExactInputMulti = () => {
  return useMutation({
    mutationKey: ['router', 'executeSwapExactInputMulti'],
    mutationFn: async (params: MultiHopSwapExactInputParams) => {
      return await executeSwapExactInputMulti(params)
    },
    onSuccess: (result) => {
      console.log('Multi-hop exact input swap executed successfully:', result)
    },
    onError: (error) => {
      console.error('Failed to execute multi-hop exact input swap:', error)
    },
  })
}

export const useExecuteSwapExactOutputMulti = () => {
  return useMutation({
    mutationKey: ['router', 'executeSwapExactOutputMulti'],
    mutationFn: async (params: MultiHopSwapExactOutputParams) => {
      return await executeSwapExactOutputMulti(params)
    },
    onSuccess: (result) => {
      console.log('Multi-hop exact output swap executed successfully:', result)
    },
    onError: (error) => {
      console.error('Failed to execute multi-hop exact output swap:', error)
    },
  })
}
