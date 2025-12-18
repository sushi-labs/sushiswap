'use client'

import { useMutation } from '@tanstack/react-query'
import { useStellarWallet } from '~stellar/providers'
import { createSushiStellarService } from '../../services/sushi-stellar-service'
import type { Token } from '../../types/token.type'

export interface UseSwapWithRoutingParams {
  userAddress: string
  tokenIn: Token
  tokenOut: Token
  amountIn: bigint
  slippage?: number
}

export const useSwapWithRouting = () => {
  const { signTransaction } = useStellarWallet()
  const service = createSushiStellarService()

  return useMutation({
    mutationKey: ['stellar', 'swap', 'swapWithRouting'],
    mutationFn: async (params: UseSwapWithRoutingParams) => {
      return await service.swapWithRouting(
        params.userAddress,
        params.tokenIn,
        params.tokenOut,
        params.amountIn,
        signTransaction,
        params.slippage || 0.005,
      )
    },
    onSuccess: (result) => {
      console.log('Swap executed successfully:', result)
      console.log('Route used:', service.formatRoute(result.route))
    },
    onError: (error) => {
      console.error('Failed to execute swap:', error)
    },
  })
}
