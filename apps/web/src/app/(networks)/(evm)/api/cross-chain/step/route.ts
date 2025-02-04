import type { NextRequest } from 'next/server'
import {
  crossChainActionSchema,
  crossChainStepSchema,
} from 'src/lib/swap/cross-chain/schema'
import { isAddress, stringify } from 'viem'
import { z } from 'zod'

const schema = crossChainStepSchema.extend({
  action: crossChainActionSchema.extend({
    fromAddress: z.string().refine((address) => isAddress(address), {
      message: 'fromAddress does not conform to Address',
    }),
    toAddress: z.string().refine((address) => isAddress(address), {
      message: 'toAddress does not conform to Address',
    }),
  }),
})

export async function POST(request: NextRequest) {
  const params = await request.json()

  const parsedParams = schema.parse(params)

  const url = new URL('https://li.quest/v1/advanced/stepTransaction')

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      ...(process.env.LIFI_API_KEY && {
        'x-lifi-api-key': process.env.LIFI_API_KEY,
      }),
    },
    body: stringify({
      ...parsedParams,
      integrator: 'sushi',
    }),
  }

  const response = await fetch(url, options)

  return Response.json(await response.json(), {
    status: response.status,
    headers: {
      'Cache-Control': 's-maxage=8, stale-while-revalidate=10',
    },
  })
}
