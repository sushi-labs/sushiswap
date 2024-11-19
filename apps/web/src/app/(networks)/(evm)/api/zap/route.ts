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
  receiver: z
    .string()
    .transform((receiver) => getAddress(receiver))
    .optional(),
  spender: z
    .string()
    .transform((spender) => getAddress(spender))
    .optional(),
  amountIn: z.union([z.string(), z.array(z.string())]),
  amountOut: z.union([z.string(), z.array(z.string())]).optional(),
  minAmountOut: z.union([z.string(), z.array(z.string())]).optional(),
  slippage: z.string().optional(), // BIPS
  // fee: z.union([z.string(), z.array(z.string())]).optional(), // BIPS
  // feeReceiver: z.string().optional(),
  disableAggregators: z.string().optional(),
  ignoreAggregators: z.string().optional(),
  ignoreStandards: z.string().optional(),
  tokenIn: z.union([z.string(), z.array(z.string())]).optional(),
  tokenOut: z.union([z.string(), z.array(z.string())]).optional(),
  quote: z.boolean().optional(),
})

export const revalidate = 600

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())

  const { quote, ...parsedParams } = schema.parse(params)

  const queryParams = new URLSearchParams(
    Object.entries(parsedParams).reduce(
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

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      'Cache-Control': 'max-age=60, stale-while-revalidate=600',
    },
  })
}
