import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { isZapSupportedChainId } from 'src/config'
import type { EvmChainId } from 'sushi/chain'
import type { Percent } from 'sushi/math'
import { sz } from 'sushi/validate'
import type { Address, Hex } from 'viem'
import { z } from 'zod'

const txSchema = z.object({
  data: sz.hex(),
  to: sz.address(),
  from: sz.address(),
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
  feeAmount: z
    .array(z.string().transform((amount) => BigInt(amount)))
    .optional(),
  priceImpact: z.number().nullable(), // BIPS
  createdAt: z.number(),
  tx: txSchema,
  route: z.array(routeSchema).optional(),
})

export type V2ZapResponse = Omit<
  z.infer<typeof zapResponseSchema>,
  'priceImpact'
> & { priceImpact: number }

type UseV2ZapParams = {
  chainId: EvmChainId
  fromAddress: Address | undefined
  receiver?: Address
  amountIn: string | string[]
  tokenIn: Address | Address[]
  tokenOut: (Address | Address[]) | undefined
  slippage: Percent
  query?: Omit<UseQueryOptions<V2ZapResponse>, 'queryKey' | 'queryFn'>
}

export const useV2Zap = ({ query, ...params }: UseV2ZapParams) => {
  return useQuery<V2ZapResponse>({
    queryKey: ['v2-zap', params],
    queryFn: async () => {
      const url = new URL('/api/zap/v2', window.location.origin)

      const { slippage, ..._params } = params

      Object.entries(_params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((val) => url.searchParams.append(key, val))
          } else {
            url.searchParams.append(key, value.toString())
          }
        }
      })

      if (slippage) {
        url.searchParams.set('slippage', slippage.multiply(100n).toFixed(0))
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const json = await response.json()
        throw new Error(json.error)
      }

      const parsed = zapResponseSchema.parse(await response.json())

      const { priceImpact } = parsed

      if (priceImpact === null) throw new Error('priceImpact is NULL')

      return { ...parsed, priceImpact }
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

export const isZapRouteNotFoundError = (error: Error) => {
  return error.message === 'Not Found'
}
