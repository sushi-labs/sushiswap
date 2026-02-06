import type { NextRequest } from 'next/server'
import type { XSwapSupportedChainId } from 'src/config'
import { stringify } from 'viem'
import * as z from 'zod'
import { stepSchema, sushiChainIdSchema } from '../schemas'

const stepBaseInputSchema = z.object({
  action: z.object({
    fromChainId: sushiChainIdSchema(),
    toChainId: sushiChainIdSchema(),
  }),
})

function parseStepInput(params: Record<string, string>) {
  const base = stepBaseInputSchema.parse(params)
  return stepSchema(
    base.action.fromChainId,
    base.action.toChainId,
    'sushi',
  ).parse(params)
}

export type CrossChainStepInput<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
> = z.input<ReturnType<typeof stepSchema<TChainId0, TChainId1, 'sushi'>>>

export type CrossChainStepResponse<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
> = z.output<ReturnType<typeof stepSchema<TChainId0, TChainId1, 'lifi'>>>

export async function POST(request: NextRequest) {
  const params = await request.json()

  const lifiParams = parseStepInput(params)

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
      ...lifiParams,
      integrator: 'sushi',
    }),
  }

  const response = await fetch(url, options)
  const json = await response.json()

  const parsed = stepSchema(
    lifiParams.action.fromChainId,
    lifiParams.action.toChainId,
    'lifi',
  ).parse(json)

  return Response.json(parsed, {
    status: response.status,
    headers: {
      'Cache-Control': 's-maxage=8, stale-while-revalidate=10',
    },
  })
}
