import { NextRequest } from 'next/server'
import { isXSwapSupportedChainId } from 'src/config'
import { isAddress } from 'viem'
import { z } from 'zod'

const schema = z.object({
  fromChainId: z.coerce
    .number()
    .refine((chainId) => isXSwapSupportedChainId(chainId), {
      message: `fromChainId must exist in XSwapChainId`,
    }),
  fromAmount: z.string(),
  fromTokenAddress: z.string().refine((token) => isAddress(token), {
    message: 'fromTokenAddress does not conform to Address',
  }),
  toChainId: z.coerce
    .number()
    .refine((chainId) => isXSwapSupportedChainId(chainId), {
      message: `toChainId must exist in XSwapChainId`,
    }),
  toTokenAddress: z.string().refine((token) => isAddress(token), {
    message: 'toTokenAddress does not conform to Address',
  }),
  fromAddress: z
    .string()
    .refine((address) => isAddress(address), {
      message: 'fromAddress does not conform to Address',
    })
    .optional(),
  toAddress: z
    .string()
    .refine((address) => isAddress(address), {
      message: 'toAddress does not conform to Address',
    })
    .optional(),
  slippage: z.coerce.number(), // decimal
  order: z.enum(['CHEAPEST', 'FASTEST']).optional(),
})

export const revalidate = 20

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())

  const { slippage, order = 'CHEAPEST', ...parsedParams } = schema.parse(params)

  const url = new URL('https://li.quest/v1/advanced/routes')

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      ...(process.env.LIFI_API_KEY && {
        'x-lifi-api-key': process.env.LIFI_API_KEY,
      }),
    },
    body: JSON.stringify({
      ...parsedParams,
      options: {
        slippage,
        order,
        integrator: 'sushi',
        exchanges: { allow: ['sushiswap'] },
        allowSwitchChain: false,
        allowDestinationCall: true,
        // fee: // TODO: must set up feeReceiver w/ lifi
      },
    }),
  }

  const response = await fetch(url, options)

  return Response.json(await response.json(), {
    status: response.status,
    headers: {
      'Cache-Control': 's-maxage=15, stale-while-revalidate=20',
    },
  })
}
