import type { NextRequest } from 'next/server'
import { type XSwapSupportedChainId, isXSwapSupportedChainId } from 'src/config'
import { mapStepToLifi } from 'src/lib/swap/cross-chain/lifi'
import { sz } from 'sushi'
import { type EvmChainId, isEvmAddress, isEvmChainId } from 'sushi/evm'
import {
  type SvmAddress,
  type SvmChainId,
  isSvmAddress,
  isSvmChainId,
} from 'sushi/svm'
import { stringify } from 'viem'
import * as z from 'zod'
import {
  lifiStepBaseSchema,
  resolveTransactionRequestChainId,
} from '../schemas'

const sushiEvmChainIdSchema = z.coerce
  .number()
  .refine(
    (chainId) => isEvmChainId(chainId) && isXSwapSupportedChainId(chainId),
    {
      message: 'chainId must exist in XSwapSupportedChainId',
    },
  )
  .transform((chainId) => chainId as XSwapSupportedChainId & EvmChainId)

const sushiSvmChainIdSchema = z.coerce
  .number()
  .refine(
    (chainId) => isSvmChainId(chainId) && isXSwapSupportedChainId(chainId),
    {
      message: 'chainId must exist in XSwapSupportedChainId',
    },
  )
  .transform((chainId) => chainId as XSwapSupportedChainId & SvmChainId)

const sushiChainIdSchema = z.union([
  sushiEvmChainIdSchema,
  sushiSvmChainIdSchema,
])

const evmAddressSchema = sz.evm.address()
const svmAddressSchema = z
  .string()
  .refine(isSvmAddress)
  .transform((address) => address as SvmAddress)

const sushiEvmTokenSchema = z.object({
  address: evmAddressSchema,
  decimals: z.number(),
  symbol: z.string(),
  chainId: sushiEvmChainIdSchema,
  name: z.string(),
  priceUSD: z.string(),
})

const sushiSvmTokenSchema = z.object({
  address: svmAddressSchema,
  decimals: z.number(),
  symbol: z.string(),
  chainId: sushiSvmChainIdSchema,
  name: z.string(),
  priceUSD: z.string(),
})

const sushiTokenSchema = z.union([sushiEvmTokenSchema, sushiSvmTokenSchema])

const sushiActionSchema = z.object({
  fromChainId: sushiChainIdSchema,
  fromAmount: z.string(),
  fromToken: sushiTokenSchema,
  toChainId: sushiChainIdSchema,
  toToken: sushiTokenSchema,
  slippage: z.number(),
  fromAddress: z.union([evmAddressSchema, svmAddressSchema]).optional(),
  toAddress: z.union([evmAddressSchema, svmAddressSchema]).optional(),
})

const sushiEstimateSchema = z.object({
  tool: z.string(),
  fromAmount: z.string(),
  toAmount: z.string(),
  toAmountMin: z.string(),
  approvalAddress: z.union([evmAddressSchema, svmAddressSchema]),
  feeCosts: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        percentage: z.string(),
        token: sushiTokenSchema,
        amount: z.string(),
        amountUSD: z.string(),
        included: z.boolean(),
      }),
    )
    .default([]),
  gasCosts: z.array(
    z.object({
      type: z.enum(['SUM', 'APPROVE', 'SEND']),
      price: z.string(),
      estimate: z.string(),
      limit: z.string(),
      amount: z.string(),
      amountUSD: z.string(),
      token: sushiTokenSchema,
    }),
  ),
  executionDuration: z.number(),
})

const sushiToolDetailsSchema = z.object({
  key: z.string(),
  name: z.string(),
  logoURI: z.string(),
})

const sushiEvmTransactionRequestSchema = z.object({
  chainId: sushiEvmChainIdSchema,
  data: sz.hex(),
  from: evmAddressSchema,
  gasLimit: sz.hex(),
  gasPrice: sz.hex(),
  to: evmAddressSchema,
  value: sz.hex(),
})

const sushiSvmTransactionRequestSchema = z
  .object({
    chainId: sushiSvmChainIdSchema.optional(),
    data: z.string(),
  })
  .passthrough()

const sushiTransactionRequestSchema = z.union([
  sushiEvmTransactionRequestSchema,
  sushiSvmTransactionRequestSchema,
])

const sushiStepBaseSchema = z.object({
  id: z.string(),
  type: z.enum(['swap', 'cross', 'lifi', 'protocol']),
  tool: z.string(),
  toolDetails: sushiToolDetailsSchema,
  action: sushiActionSchema,
  estimate: sushiEstimateSchema,
  transactionRequest: sushiTransactionRequestSchema.optional(),
})

const sushiStepSchema = sushiStepBaseSchema.extend({
  includedSteps: z.array(sushiStepBaseSchema),
})

const stepInputSchema = sushiStepSchema
  .extend({
    action: sushiActionSchema.extend({
      fromAddress: z.string(),
      toAddress: z.string(),
    }),
  })
  .superRefine((data, ctx) => {
    const isFromSvm = isSvmChainId(data.action.fromChainId)
    const isToSvm = isSvmChainId(data.action.toChainId)

    const isFromAddressValid = isFromSvm
      ? isSvmAddress(data.action.fromAddress)
      : isEvmAddress(data.action.fromAddress)
    if (!isFromAddressValid) {
      ctx.addIssue({
        code: 'custom',
        path: ['action', 'fromAddress'],
        message: 'fromAddress does not conform to chain address format',
      })
    }

    const isToAddressValid = isToSvm
      ? isSvmAddress(data.action.toAddress)
      : isEvmAddress(data.action.toAddress)
    if (!isToAddressValid) {
      ctx.addIssue({
        code: 'custom',
        path: ['action', 'toAddress'],
        message: 'toAddress does not conform to chain address format',
      })
    }
  })
  .transform((data) => {
    const transactionRequest =
      data.transactionRequest &&
      'chainId' in data.transactionRequest &&
      data.transactionRequest.chainId == null
        ? { ...data.transactionRequest, chainId: data.action.fromChainId }
        : data.transactionRequest

    return mapStepToLifi({
      ...data,
      transactionRequest,
    })
  })

export type CrossChainStepInput = z.input<typeof stepInputSchema>
export type CrossChainStepLifiRequest = z.output<typeof stepInputSchema>

const stepOutputSchema = lifiStepBaseSchema
  .extend({
    includedSteps: z.array(lifiStepBaseSchema),
  })
  .transform((data) => {
    const resolved = resolveTransactionRequestChainId(data)

    return {
      ...resolved,
      includedStepsWithoutFees: resolved.includedSteps.filter(
        (step) => step.tool !== 'feeCollection',
      ),
    }
  })

export type CrossChainStepResponse = z.output<typeof stepOutputSchema>

export async function POST(request: NextRequest) {
  const params = await request.json()

  const lifiParams = stepInputSchema.parse(params)

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

  const parsed = stepOutputSchema.parse(json)

  return Response.json(parsed, {
    status: response.status,
    headers: {
      'Cache-Control': 's-maxage=8, stale-while-revalidate=10',
    },
  })
}
