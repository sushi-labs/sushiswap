import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { isZapSupportedChainId } from 'src/config'
import { ChainId } from 'sushi/chain'
import { Address, Hex } from 'viem'
import { z } from 'zod'

const txSchema = z.object({
  data: z.string().transform((data) => data as Hex),
  to: z.string().transform((to) => to as Address),
  from: z.string().transform((from) => from as Address),
  value: z.string().transform((value) => BigInt(value)),
})

type Route = {
  action: string
  protocol: string
  tokenIn: Address[]
  tokenOut: Address[]
  primary?: Address
  internalRoutes?: Route[][]
}

const routeSchema: z.ZodType<Route> = z.lazy(() =>
  z.object({
    action: z.string(),
    protocol: z.string(),
    tokenIn: z.array(z.custom<Address>()),
    tokenOut: z.array(z.custom<Address>()),
    primary: z.custom<Address>().optional(),
    internalRoutes: z.array(z.array(routeSchema)).optional(),
  }),
)

const zapResponseSchema = z.object({
  gas: z.string().transform((gas) => BigInt(gas)),
  amountOut: z.string().transform((amount) => BigInt(amount)),
  priceImpact: z.number(),
  createdAt: z.number(),
  tx: txSchema,
  route: z.array(routeSchema).optional(),
})

export type ZapResponse = z.infer<typeof zapResponseSchema>

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
  tokenIn: Address | Address[]
  tokenOut?: Address | Address[]
  query?: Omit<UseQueryOptions<ZapResponse>, 'queryKey' | 'queryFn'>
}

export const useZap = ({ query, ...params }: UseZapParams) => {
  return useQuery<ZapResponse>({
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

      return zapResponseSchema.parse(await response.json())
    },
    staleTime: query?.staleTime ?? 1000 * 60 * 1, // 1 minutes
    enabled:
      query?.enabled !== false &&
      Boolean(
        isZapSupportedChainId(params.chainId) &&
          typeof params.fromAddress !== 'undefined' &&
          typeof params.tokenOut !== 'undefined' &&
          (Array.isArray(params.amountIn)
            ? params.amountIn.every((amount) => +amount > 0)
            : +params.amountIn > 0),
      ),
    ...query,
  })
}
