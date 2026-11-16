import type { NextRequest } from 'next/server'
import {
  EVM_UI_FEE_DECIMAL,
  type LifiXSwapSupportedChainId,
  XSWAP_STABLE_UI_FEE_DECIMAL,
  XSWAP_SUSHI_UI_FEE_DECIMAL,
} from 'src/config'
import {
  getLifiPerpsRoutesRequest,
  parseLifiPerpsRoutesResponse,
} from 'src/lib/perps/deposit/lifi-perps-api'
import {
  type LifiPerpsRoutesInput,
  lifiPerpsRoutesInputSchema,
} from 'src/lib/perps/deposit/lifi-perps-schemas'
import { isLifiNoRouteResponse } from 'src/lib/swap/cross-chain/route-availability'
import * as z from 'zod'
import { postLifiRequest } from '../lifi-client'
import {
  type LifiChainId,
  getAddressSchema,
  isStableToStable,
  isSushiToSushi,
  lifiChainIdSchema,
  lifiToSushiChainId,
  stepSchema,
  sushiChainIdSchema,
  sushiToLifiChainId,
  tokenSchema,
} from '../schemas'

const routesBaseInputSchema = z.object({
  fromChainId: sushiChainIdSchema(),
  toChainId: sushiChainIdSchema(),
})

function routesInputSchema<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>(fromChainId: TChainId0, toChainId: TChainId1) {
  return z.object({
    fromChainId: sushiChainIdSchema(fromChainId).transform(sushiToLifiChainId),
    fromAmount: z.string(),
    fromTokenAddress: getAddressSchema(fromChainId),
    toChainId: sushiChainIdSchema(toChainId).transform(sushiToLifiChainId),
    toTokenAddress: getAddressSchema(toChainId),
    fromAddress: getAddressSchema(fromChainId).optional(),
    toAddress: getAddressSchema(toChainId).optional(),
    slippage: z.coerce.number(),
    order: z.enum(['CHEAPEST', 'FASTEST']).optional(),
  })
}

function parseRoutesInput(params: Record<string, string>) {
  const base = routesBaseInputSchema.parse(params)
  return routesInputSchema(base.fromChainId, base.toChainId).parse(params)
}

export type CrossChainRoutesInput<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
> = z.input<ReturnType<typeof routesInputSchema<TChainId0, TChainId1>>>

function routesOutputSchema<
  TChainId0 extends LifiChainId,
  TChainId1 extends LifiChainId,
>(fromChainId: TChainId0, toChainId: TChainId1) {
  return z.object({
    routes: z.array(
      z
        .object({
          id: z.string(),
          fromChainId: lifiChainIdSchema(fromChainId as LifiChainId).transform(
            (c) => lifiToSushiChainId(c),
          ),
          fromAmountUSD: z.string().optional(),
          fromAmount: z.string(),
          fromToken: tokenSchema(fromChainId, 'lifi'),
          fromAddress: z.string().optional(),
          toChainId: lifiChainIdSchema(toChainId as LifiChainId).transform(
            (c) => lifiToSushiChainId(c),
          ),
          toAmountUSD: z.string().optional(),
          toAmount: z.string(),
          toAmountMin: z.string(),
          toToken: tokenSchema(toChainId, 'lifi'),
          gasCostUSD: z.string().optional(),
          containsSwitchChain: z.boolean().optional(),
          steps: z.array(stepSchema(fromChainId, toChainId, 'lifi')),
          tags: z
            .array(z.enum(['RECOMMENDED', 'FASTEST', 'CHEAPEST', 'SAFEST']))
            .optional(),
        })
        .refine((data) => data.steps.length === 1, {
          message: 'multi-step routes are not supported',
        })
        .transform((data) => {
          const { steps, ...rest } = data

          return {
            step: steps[0],
            ...rest,
          } as typeof data & { step: (typeof steps)[number] } & { steps: never }
        }),
    ),
  })
}

export type CrossChainRoutesResponse<
  TChainId0 extends LifiChainId,
  TChainId1 extends LifiChainId,
> = z.output<ReturnType<typeof routesOutputSchema<TChainId0, TChainId1>>>

type RoutesRequestContext =
  | {
      destination: 'perps'
      input: LifiPerpsRoutesInput
      body: ReturnType<typeof getLifiPerpsRoutesRequest>
    }
  | {
      destination: 'swap'
      input: ReturnType<typeof parseRoutesInput>
      body: Record<string, unknown>
    }

function getRoutesRequest(
  params: Record<string, string>,
): RoutesRequestContext {
  if (params.destination === 'perps') {
    const { destination: _destination, ...source } = params
    const input = lifiPerpsRoutesInputSchema.parse(source)
    return {
      destination: 'perps',
      input,
      body: getLifiPerpsRoutesRequest(input),
    }
  }
  const input = parseRoutesInput(params)
  const { slippage, order = 'CHEAPEST', ...parsedParams } = input

  return {
    destination: 'swap',
    input,
    body: {
      ...parsedParams,
      options: {
        slippage,
        order,
        integrator: 'sushi',
        exchanges: { allow: ['sushiswap'] },
        allowSwitchChain: false,
        allowDestinationCall: true,
        fee: isSushiToSushi({
          fromTokenAddress: parsedParams.fromTokenAddress,
          fromTokenChainId: parsedParams.fromChainId,
          toTokenAddress: parsedParams.toTokenAddress,
          toTokenChainId: parsedParams.toChainId,
        })
          ? XSWAP_SUSHI_UI_FEE_DECIMAL
          : isStableToStable({
                fromTokenAddress: parsedParams.fromTokenAddress,
                fromTokenChainId: parsedParams.fromChainId,
                toTokenAddress: parsedParams.toTokenAddress,
                toTokenChainId: parsedParams.toChainId,
              })
            ? XSWAP_STABLE_UI_FEE_DECIMAL
            : EVM_UI_FEE_DECIMAL,
      },
    },
  }
}

export async function GET(request: NextRequest): Promise<Response> {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())
  const isPerps = params.destination === 'perps'
  if (params.destination !== undefined && !isPerps) {
    return Response.json({ error: 'Unsupported destination' }, { status: 400 })
  }
  let context: RoutesRequestContext
  try {
    context = getRoutesRequest(params)
  } catch (error) {
    if (!isPerps) throw error
    return Response.json(
      { error: 'Invalid perps deposit quote' },
      { status: 400 },
    )
  }

  try {
    const { response, json } = await postLifiRequest(
      'routes',
      context.body,
      isPerps ? 'no-store' : undefined,
    )
    // Preserve outages and rate limits instead of treating them as no route.
    if (isLifiNoRouteResponse(response.status, json)) {
      return Response.json({ routes: [] })
    }
    if (context.destination === 'perps') {
      if (!response.ok) {
        return Response.json(
          { error: 'Unable to quote perps deposit' },
          { status: response.status },
        )
      }
      return Response.json(parseLifiPerpsRoutesResponse(json, context.input), {
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    const { routes } = z.object({ routes: z.unknown().nullish() }).parse(json)
    const parsed = routesOutputSchema(
      context.input.fromChainId,
      context.input.toChainId,
    ).parse({ routes: routes ?? [] })

    return Response.json(parsed, {
      status: response.status,
      headers: { 'Cache-Control': 's-maxage=15, stale-while-revalidate=20' },
    })
  } catch (error) {
    if (!isPerps) throw error
    return Response.json(
      { error: 'Unable to quote perps deposit' },
      { status: 502 },
    )
  }
}
