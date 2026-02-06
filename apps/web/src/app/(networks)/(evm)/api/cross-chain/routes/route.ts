import type { NextRequest } from 'next/server'
import { type XSwapSupportedChainId, isXSwapSupportedChainId } from 'src/config'
import {
  type LIFI_SOLANA_CHAIN_ID,
  lifiToSushiChainId,
  sushiToLifiChainId,
} from 'src/lib/swap/cross-chain/lifi'
import { isEvmAddress } from 'sushi/evm'
import { isSvmAddress, isSvmChainId } from 'sushi/svm'
import * as z from 'zod'
import {
  lifiChainIdSchema,
  lifiStepSchema,
  lifiTokenSchema,
  lifiTransactionRequestSchema,
  resolveTransactionRequestChainId,
} from '../schemas'

const sushiChainIdSchema = z.coerce
  .number()
  .refine((chainId) => isXSwapSupportedChainId(chainId), {
    message: 'chainId must exist in XSwapChainId',
  })

const routesInputSchema = z
  .object({
    fromChainId: sushiChainIdSchema,
    fromAmount: z.string(),
    fromTokenAddress: z.string(),
    toChainId: sushiChainIdSchema,
    toTokenAddress: z.string(),
    fromAddress: z.string().optional(),
    toAddress: z.string().optional(),
    slippage: z.coerce.number(), // decimal
    order: z.enum(['CHEAPEST', 'FASTEST']).optional(),
  })
  .superRefine((data, ctx) => {
    const isFromSvm = isSvmChainId(data.fromChainId)
    const isToSvm = isSvmChainId(data.toChainId)

    const isFromTokenValid = isFromSvm
      ? isSvmAddress(data.fromTokenAddress)
      : isEvmAddress(data.fromTokenAddress)
    if (!isFromTokenValid) {
      ctx.addIssue({
        code: 'custom',
        path: ['fromTokenAddress'],
        message: 'fromTokenAddress does not conform to chain address format',
      })
    }

    const isToTokenValid = isToSvm
      ? isSvmAddress(data.toTokenAddress)
      : isEvmAddress(data.toTokenAddress)
    if (!isToTokenValid) {
      ctx.addIssue({
        code: 'custom',
        path: ['toTokenAddress'],
        message: 'toTokenAddress does not conform to chain address format',
      })
    }

    if (data.fromAddress) {
      const isFromAddressValid = isFromSvm
        ? isSvmAddress(data.fromAddress)
        : isEvmAddress(data.fromAddress)
      if (!isFromAddressValid) {
        ctx.addIssue({
          code: 'custom',
          path: ['fromAddress'],
          message: 'fromAddress does not conform to chain address format',
        })
      }
    }

    if (data.toAddress) {
      const isToAddressValid = isToSvm
        ? isSvmAddress(data.toAddress)
        : isEvmAddress(data.toAddress)

      if (!isToAddressValid) {
        ctx.addIssue({
          code: 'custom',
          path: ['toAddress'],
          message: 'toAddress does not conform to chain address format',
        })
      }
    }
  })
  .transform((data) => ({
    ...data,
    fromChainId: sushiToLifiChainId(data.fromChainId),
    toChainId: sushiToLifiChainId(data.toChainId),
  }))

export type CrossChainRoutesInput = z.input<typeof routesInputSchema>
export type CrossChainRoutesLifiRequest = z.output<typeof routesInputSchema>

const lifiRouteSchema = z
  .object({
    id: z.string(),
    fromChainId: lifiChainIdSchema,
    fromAmount: z.string(),
    fromToken: lifiTokenSchema,
    toChainId: lifiChainIdSchema,
    toAmount: z.string(),
    toAmountMin: z.string(),
    toToken: lifiTokenSchema,
    gasCostUSD: z.string(),
    steps: z.array(
      lifiStepSchema.transform((data) => {
        const resolved = resolveTransactionRequestChainId(data)

        return {
          ...resolved,
          includedStepsWithoutFees: resolved.includedSteps.filter(
            (step) => step.tool !== 'feeCollection',
          ),
        }
      }),
    ),
    tags: z.array(z.string()).optional(),
    transactionRequest: lifiTransactionRequestSchema.optional(),
  })
  .transform((data) => ({
    ...data,
    fromChainId: lifiToSushiChainId(
      data.fromChainId as XSwapSupportedChainId | typeof LIFI_SOLANA_CHAIN_ID,
    ),
    toChainId: lifiToSushiChainId(
      data.toChainId as XSwapSupportedChainId | typeof LIFI_SOLANA_CHAIN_ID,
    ),
  }))
  .refine((data) => data.steps.length === 1, {
    message: 'multi-step routes are not supported',
  })
  .transform((data) => {
    const { steps, ...rest } = data
    return {
      ...rest,
      step: steps[0],
    }
  })

const routesOutputSchema = z.object({
  routes: z.array(lifiRouteSchema),
})

export type CrossChainRoutesResponse = z.output<typeof routesOutputSchema>

export const revalidate = 20

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())

  const {
    slippage,
    order = 'CHEAPEST',
    ...requestParams
  } = routesInputSchema.parse(params)

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
      ...requestParams,
      options: {
        slippage,
        order,
        integrator: 'sushi',
        exchanges: { allow: ['sushiswap'] },
        allowSwitchChain: false,
        allowDestinationCall: true,
        // fee: EVM_UI_FEE_DECIMAL, // e.g. 0.0025 (0.25%)
      },
    }),
  }

  const response = await fetch(url, options)
  const json = await response.json()

  const parsed = routesOutputSchema.parse({
    routes: json.routes ?? [],
  })

  return Response.json(parsed, {
    status: response.status,
    headers: {
      'Cache-Control': 's-maxage=15, stale-while-revalidate=20',
    },
  })
}
