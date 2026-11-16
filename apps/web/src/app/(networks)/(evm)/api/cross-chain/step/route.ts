import type { NextRequest } from 'next/server'
import type { LifiXSwapSupportedChainId } from 'src/config'
import {
  getLifiPerpsStepRequest,
  parseLifiPerpsPreparedStep,
} from 'src/lib/perps/deposit/lifi-perps-api'
import {
  type LifiPerpsStep,
  lifiPerpsStepSchema,
} from 'src/lib/perps/deposit/lifi-perps-schemas'
import * as z from 'zod'
import { postLifiRequest } from '../lifi-client'
import { stepSchema, sushiChainIdSchema } from '../schemas'

const stepBaseInputSchema = z.object({
  action: z.object({
    fromChainId: sushiChainIdSchema(),
    toChainId: sushiChainIdSchema(),
  }),
})

function parseStepInput(params: unknown) {
  const base = stepBaseInputSchema.parse(params)
  return stepSchema(
    base.action.fromChainId,
    base.action.toChainId,
    'sushi',
  ).parse(params)
}

export type CrossChainStepInput<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
> = z.input<ReturnType<typeof stepSchema<TChainId0, TChainId1, 'sushi'>>>

export type CrossChainStepResponse<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
> = z.output<ReturnType<typeof stepSchema<TChainId0, TChainId1, 'lifi'>>>

type StepRequestContext =
  | { destination: 'perps'; input: LifiPerpsStep }
  | { destination: 'swap'; input: ReturnType<typeof parseStepInput> }

export async function POST(request: NextRequest): Promise<Response> {
  const destination = request.nextUrl.searchParams.get('destination')
  const isPerps = destination === 'perps'
  if (destination !== null && !isPerps) {
    return Response.json({ error: 'Unsupported destination' }, { status: 400 })
  }
  let context: StepRequestContext
  try {
    const params: unknown = await request.json()
    context = isPerps
      ? { destination: 'perps', input: lifiPerpsStepSchema.parse(params) }
      : { destination: 'swap', input: parseStepInput(params) }
  } catch (error) {
    if (!isPerps) throw error
    return Response.json(
      { error: 'Invalid perps deposit step' },
      { status: 400 },
    )
  }

  try {
    const body =
      context.destination === 'perps'
        ? getLifiPerpsStepRequest(context.input)
        : { ...context.input, integrator: 'sushi' }
    const { response, json } = await postLifiRequest(
      'stepTransaction',
      body,
      isPerps ? 'no-store' : undefined,
    )
    if (context.destination === 'perps') {
      if (!response.ok) {
        return Response.json(
          { error: 'Unable to prepare perps deposit' },
          { status: response.status },
        )
      }
      return Response.json(parseLifiPerpsPreparedStep(json, context.input), {
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    const parsed = stepSchema(
      context.input.action.fromChainId,
      context.input.action.toChainId,
      'lifi',
    ).parse(json)

    return Response.json(parsed, {
      status: response.status,
      headers: { 'Cache-Control': 's-maxage=8, stale-while-revalidate=10' },
    })
  } catch (error) {
    if (!isPerps) throw error
    return Response.json(
      { error: 'Unable to prepare perps deposit' },
      { status: 502 },
    )
  }
}
