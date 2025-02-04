import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import type { Amount, Type } from 'sushi/currency'
import type { Percent } from 'sushi/math'
import { type Address, zeroAddress } from 'viem'
import { z } from 'zod'
import { crossChainRouteSchema } from '../../../swap/cross-chain/schema'
import type { CrossChainRoute } from '../../../swap/cross-chain/types'

const crossChainRoutesResponseSchema = z.object({
  routes: z.array(crossChainRouteSchema),
})

export interface UseCrossChainTradeRoutesParms {
  fromAmount?: Amount<Type>
  toToken?: Type
  fromAddress?: Address
  toAddress?: Address
  slippage: Percent
  order?: 'CHEAPEST' | 'FASTEST'
  query?: Omit<UseQueryOptions<CrossChainRoute[]>, 'queryFn' | 'queryKey'>
}

export const useCrossChainTradeRoutes = ({
  query,
  ...params
}: UseCrossChainTradeRoutesParms) => {
  return useQuery<CrossChainRoute[]>({
    queryKey: ['cross-chain/routes', params],
    queryFn: async (): Promise<CrossChainRoute[]> => {
      const { fromAmount, toToken, slippage } = params

      if (!fromAmount || !toToken) throw new Error()

      const url = new URL('/api/cross-chain/routes', window.location.origin)

      url.searchParams.set(
        'fromChainId',
        fromAmount.currency.chainId.toString(),
      )
      url.searchParams.set('toChainId', toToken.chainId.toString())
      url.searchParams.set(
        'fromTokenAddress',
        fromAmount.currency.isNative
          ? zeroAddress
          : fromAmount.currency.address,
      )
      url.searchParams.set(
        'toTokenAddress',
        toToken.isNative ? zeroAddress : toToken.address,
      )
      url.searchParams.set('fromAmount', fromAmount.quotient.toString())
      url.searchParams.set('slippage', `${+slippage.toFixed(2) / 100}`)
      params.fromAddress &&
        url.searchParams.set('fromAddress', params.fromAddress)
      params.toAddress ||
        (params.fromAddress &&
          url.searchParams.set(
            'toAddress',
            params.toAddress || params.fromAddress,
          ))
      params.order && url.searchParams.set('order', params.order)

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const json = await response.json()

      const { routes } = crossChainRoutesResponseSchema.parse(json)

      return routes
    },
    refetchInterval: query?.refetchInterval ?? 1000 * 20, // 20s
    enabled:
      query?.enabled !== false &&
      Boolean(params.toToken && params.fromAmount?.greaterThan(0)),
    ...query,
  })
}
