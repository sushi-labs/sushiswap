import type { NextRequest } from 'next/server'
import { EVM_UI_FEE_DECIMAL, type XSwapSupportedChainId } from 'src/config'
import * as z from 'zod'
import {
  type LifiChainId,
  getAddressSchema,
  lifiChainIdSchema,
  lifiToSushiChainId,
  stepSchema,
  sushiChainIdSchema,
  sushiToLifiChainId,
  tokenSchema,
  transactionRequestSchema,
} from '../schemas'

const routesBaseInputSchema = z.object({
  fromChainId: sushiChainIdSchema(),
  toChainId: sushiChainIdSchema(),
})

function routesInputSchema<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
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
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
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
          toAddress: z.string().optional(),
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

export const revalidate = 20

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())

  const {
    slippage,
    order = 'CHEAPEST',
    ...parsedParams
  } = parseRoutesInput(params)

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
        fee: EVM_UI_FEE_DECIMAL, // e.g. 0.0035 (0.35%)
      },
    }),
  }

  const response = await fetch(url, options)
  const json = await response.json()

  const parsed = routesOutputSchema(
    parsedParams.fromChainId,
    parsedParams.toChainId,
  ).parse({
    routes: json.routes ?? [],
  })

  return Response.json(parsed, {
    status: response.status,
    headers: {
      'Cache-Control': 's-maxage=15, stale-while-revalidate=20',
    },
  })
}
