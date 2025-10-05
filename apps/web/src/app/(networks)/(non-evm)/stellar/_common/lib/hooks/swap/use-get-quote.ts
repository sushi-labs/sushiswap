'use client'

import { useQuery } from '@tanstack/react-query'
import { createSushiStellarService } from '../../services/sushi-stellar-service'
import type { Token } from '../../types/token.type'

export interface UseGetQuoteParams {
  tokenIn: Token
  tokenOut: Token
  amountIn: bigint
  enabled?: boolean
}

export const useGetQuote = (params: UseGetQuoteParams) => {
  const service = createSushiStellarService()

  return useQuery({
    queryKey: ['swap', 'quote', params.tokenIn.contract, params.tokenOut.contract, params.amountIn.toString()],
    queryFn: async () => {
      const route = await service.findBestRoute(params.tokenIn, params.tokenOut, params.amountIn)
      if (route) {
        console.log('Quote received:', {
          amountOut: route.amountOut,
          route: service.formatRoute(route),
          priceImpact: route.priceImpact
        })
      }
      return route
    },
    enabled: params.enabled !== false && params.amountIn > 0n,
    staleTime: 30000, // 30 seconds
    refetchInterval: 10000, // 10 seconds
  })
}
