import type { NextRequest } from 'next/server'
import {
  UI_FEE_BIPS,
  type ZapSupportedChainId,
  isZapSupportedChainId,
} from 'src/config'
import { sz } from 'sushi'
import { UI_FEE_COLLECTOR_ADDRESS, isUIFeeCollectorChainId } from 'sushi/evm'
import { z } from 'zod'

const schema = z.object({
  chainId: z.coerce
    .number()
    .refine((chainId) => isZapSupportedChainId(chainId), {
      message: 'chainId must exist in EnsoSupportedChainId',
    })
    .transform((chainId) => chainId as ZapSupportedChainId),
  fromAddress: sz.evm.address(),
  routingStrategy: z
    .enum(['ensowallet', 'router', 'delegate'])
    .default('router'),
  receiver: sz.evm.address().optional(),
  spender: sz.evm.address().optional(),
  amountIn: z.union([z.string(), z.array(z.string())]),
  minAmountOut: z.union([z.string(), z.array(z.string())]).optional(),
  slippage: z.string().optional(), // BIPS
  tokenIn: z.union([z.string(), z.array(z.string())]),
  tokenOut: z.union([z.string(), z.array(z.string())]),
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
    url.searchParams.set('fee', `${UI_FEE_BIPS}`) // e.g. 25 (0.25%)
    url.searchParams.set(
      'feeReceiver',
      isUIFeeCollectorChainId(parsedParams.chainId)
        ? UI_FEE_COLLECTOR_ADDRESS[parsedParams.chainId]
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
