import { NextRequest } from 'next/server'
import { ZapSupportedChainId, isZapSupportedChainId } from 'src/config'
import { getAddress } from 'viem/utils'
import { z } from 'zod'

const schema = z.object({
  chainId: z.coerce
    .number()
    .refine((chainId) => isZapSupportedChainId(chainId), {
      message: 'chainId must exist in EnsoSupportedChainId',
    })
    .transform((chainId) => chainId as ZapSupportedChainId),
  fromAddress: z.string().transform((from) => getAddress(from)),
  routingStrategy: z
    .enum(['ensowallet', 'router', 'delegate'])
    .default('router'),
  // toEoa: z.boolean(), // DEPRECATED
  receiver: z.optional(
    z.string().transform((receiver) => getAddress(receiver)),
  ),
  spender: z.optional(z.string().transform((spender) => getAddress(spender))),
  amountIn: z.union([z.string(), z.array(z.string())]),
  amountOut: z.optional(z.union([z.string(), z.array(z.string())])),
  minAmountOut: z.optional(z.union([z.string(), z.array(z.string())])),
  slippage: z.optional(z.string()),
  fee: z.optional(z.union([z.string(), z.array(z.string())])),
  feeReceiver: z.optional(z.string()),
  disableAggregators: z.optional(z.string()),
  ignoreAggregators: z.optional(z.string()),
  ignoreStandards: z.optional(z.string()),
  tokenIn: z.optional(z.union([z.string(), z.array(z.string())])),
  tokenOut: z.optional(z.union([z.string(), z.array(z.string())])),
  quote: z.optional(z.boolean()),
})

export const revalidate = 600

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())

  const { quote, ...parsedParams } = schema.parse(params)

  const queryParams = new URLSearchParams(
    Object.entries(params).reduce(
      (accum: [string, string][], [key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((val) => accum.push([key, val.toString()]))
          } else {
            accum.push([key, value.toString()])
          }
        }
        return accum
      },
      [] as [string, string][],
    ),
  )

  const response = await fetch(
    `https://api.enso.finance/api/v1/shortcuts/${
      quote === true ? 'quote' : 'route'
    }?${queryParams.toString()}`,
    {
      headers: {
        'x-wagmi-address': parsedParams.fromAddress,
        Authorization: `Bearer ${process.env.ENSO_API_KEY}`,
      },
    },
  )

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Cache-Control': 'max-age=60, stale-while-revalidate=600',
    },
  })
}
