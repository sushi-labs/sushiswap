import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { isEnsoSupportedChainId } from 'src/config'
import { ChainId } from 'sushi/chain'
import { Address, Hex } from 'viem'

export interface ZapResponse {
  gas: string
  amountOut: string
  priceImpact: number
  createdAt: number
  tx: Tx
  route?: RouteDetailsProps[]
}

export interface Tx {
  data: Hex
  to: Address
  from: Address
  value: string
}

type RouteDetailsProps = {
  action: string
  protocol: string
  tokenIn: Address[]
  tokenOut: Address[]
  primary?: boolean
  internalRoutes?: RouteDetailsProps[]
}

type UseZapParams = {
  chainId: ChainId
  fromAddress?: Address
  routingStrategy?: string
  receiver?: Address
  spender?: Address
  amountIn: string | string[]
  amountOut?: string | string[]
  minAmountOut?: string | string[]
  slippage?: string
  fee?: string | string[]
  feeReceiver?: string
  disableRFQs?: boolean
  ignoreAggregators?: string | string[]
  ignoreStandards?: string | string[]
  tokenIn: Address[]
  tokenOut: Address[]
  query?: Omit<UseQueryOptions<ZapResponse>, 'queryKey' | 'queryFn'>
}

export const useZap = ({ query, ...params }: UseZapParams) => {
  return useQuery({
    queryKey: ['zap', params],
    queryFn: async () => {
      const url = new URL('/api/zap', window.location.origin)

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((val) => url.searchParams.append(key, val))
          } else {
            url.searchParams.append(key, value.toString())
          }
        }
      })

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      return (await response.json()) as ZapResponse
    },
    staleTime: query?.staleTime ?? 1000 * 60 * 1, // 1 minutes
    enabled:
      query?.enabled !== false &&
      Boolean(
        isEnsoSupportedChainId(params.chainId) &&
          params.fromAddress &&
          Array.isArray(params.amountIn)
          ? params.amountIn.every((amount) => +amount > 0)
          : +params.amountIn > 0,
      ),
    ...query,
  })
}
