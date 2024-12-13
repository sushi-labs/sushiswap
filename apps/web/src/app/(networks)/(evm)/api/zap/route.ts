import { NextRequest } from 'next/server'
import { ZapSupportedChainId, isZapSupportedChainId } from 'src/config'
import { TOKEN_CHOMPER_ADDRESS, isTokenChomperChainId } from 'sushi/config'
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
  tokenIn: z.union([z.string(), z.array(z.string())]).optional(),
  tokenOut: z.union([z.string(), z.array(z.string())]).optional(),
  quote: z.boolean().optional(),
})

export const revalidate = 600

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())

  const { quote, ...parsedParams } = schema.parse(params)

  const url = new URL(
    `https://api.enso.finance/api/v1/shortcuts/${
      quote === true ? 'quote' : 'route'
    }`,
  )

  Object.entries(parsedParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((val) => url.searchParams.append(key, val.toString()))
      } else {
        url.searchParams.append(key, value.toString())
      }
    }

    url.searchParams.set('priceImpact', 'true')
    url.searchParams.set('fee', '25') // 0.25%
    url.searchParams.set(
      'feeReceiver',
      isTokenChomperChainId(parsedParams.chainId)
        ? TOKEN_CHOMPER_ADDRESS[parsedParams.chainId]
        : '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098',
    )
  })

  const response = await fetch(url, {
    headers: {
      'x-wagmi-address': parsedParams.fromAddress,
      Authorization: `Bearer ${process.env.ENSO_API_KEY}`,
    },
  })

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      'Cache-Control': 'max-age=60, stale-while-revalidate=600',
    },
  })
}
