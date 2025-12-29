'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
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
    queryKey: [
      'stellar',
      'swap',
      'quote',
      params.tokenIn.contract,
      params.tokenOut.contract,
      params.amountIn.toString(),
    ],
    queryFn: async () => {
      const route = await service.findBestRoute(
        params.tokenIn,
        params.tokenOut,
        params.amountIn,
      )
      return route
    },
    enabled: Boolean(params.enabled !== false && params.amountIn > 0n),
    staleTime: ms('30s'),
    refetchInterval: ms('10s'),
  })
}
