import { type XSwapSupportedChainId, isXSwapSupportedChainId } from 'src/config'
import {
  LIFI_SOLANA_CHAIN_ID,
  lifiToSushiChainId,
} from 'src/lib/swap/cross-chain/lifi'
import { sz } from 'sushi'
import { type EvmChainId, isEvmAddress, isEvmChainId } from 'sushi/evm'
import {
  type SvmAddress,
  SvmChainId,
  isSvmAddress,
  isSvmChainId,
} from 'sushi/svm'
import * as z from 'zod'

const lifiChainIdSchema = z
  .number()
  .refine(
    (chainId) =>
      chainId === LIFI_SOLANA_CHAIN_ID || isXSwapSupportedChainId(chainId),
    {
      message: 'chainId must exist in XSwapSupportedChainId',
    },
  )

const lifiEvmChainIdSchema = lifiChainIdSchema
  .refine((chainId) => isEvmChainId(chainId), {
    message: 'chainId must exist in XSwapSupportedChainId',
  })
  .transform((chainId) => chainId as XSwapSupportedChainId & EvmChainId)

const lifiSvmChainIdSchema = lifiChainIdSchema
  .refine(
    (chainId) => chainId === LIFI_SOLANA_CHAIN_ID || isSvmChainId(chainId),
    {
      message: 'chainId must exist in XSwapSupportedChainId',
    },
  )
  .transform((chainId) => {
    if (chainId === LIFI_SOLANA_CHAIN_ID) {
      return SvmChainId.SOLANA
    }
    return chainId as XSwapSupportedChainId & SvmChainId
  })

const evmAddressSchema = sz.evm.address()
const svmAddressSchema = z
  .string()
  .refine(isSvmAddress)
  .transform((address) => address as SvmAddress)

function isLifiSvmChainId(chainId: number) {
  return chainId === LIFI_SOLANA_CHAIN_ID || isSvmChainId(chainId)
}

const baseLifiTokenSchema = z.object({
  decimals: z.number(),
  symbol: z.string(),
  name: z.string(),
  priceUSD: z.string(),
})

const evmLifiTokenSchema = baseLifiTokenSchema.extend({
  address: evmAddressSchema,
  chainId: lifiEvmChainIdSchema,
})

const svmLifiTokenSchema = baseLifiTokenSchema.extend({
  address: svmAddressSchema,
  chainId: lifiSvmChainIdSchema,
})

const lifiTokenSchema = z.union([evmLifiTokenSchema, svmLifiTokenSchema])

const lifiActionSchema = z
  .object({
    fromChainId: lifiChainIdSchema,
    fromAmount: z.string(),
    fromToken: lifiTokenSchema,
    toChainId: lifiChainIdSchema,
    toToken: lifiTokenSchema,
    slippage: z.number(),
    fromAddress: z.string().optional(),
    toAddress: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.fromAddress) {
      const isValidAddress = isLifiSvmChainId(data.fromChainId)
        ? isSvmAddress(data.fromAddress)
        : isEvmAddress(data.fromAddress)
      if (!isValidAddress) {
        ctx.addIssue({
          code: 'custom',
          path: ['fromAddress'],
          message: 'Invalid address',
        })
      }
    }

    if (data.toAddress) {
      const isValidAddress = isLifiSvmChainId(data.toChainId)
        ? isSvmAddress(data.toAddress)
        : isEvmAddress(data.toAddress)
      if (!isValidAddress) {
        ctx.addIssue({
          code: 'custom',
          path: ['toAddress'],
          message: 'Invalid address',
        })
      }
    }
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

const lifiEstimateSchema = z.object({
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
        token: lifiTokenSchema,
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
      token: lifiTokenSchema,
    }),
  ),
  executionDuration: z.number(),
})

const lifiToolDetailsSchema = z.object({
  key: z.string(),
  name: z.string(),
  logoURI: z.string(),
})

const lifiEvmTransactionRequestSchema = z
  .object({
    chainId: lifiEvmChainIdSchema,
    data: sz.hex(),
    from: evmAddressSchema,
    gasLimit: sz.hex(),
    gasPrice: sz.hex(),
    to: evmAddressSchema,
    value: sz.hex(),
  })
  .transform((data) => ({
    ...data,
    chainId: lifiToSushiChainId(
      data.chainId as XSwapSupportedChainId | typeof LIFI_SOLANA_CHAIN_ID,
    ),
  }))

const lifiSvmTransactionRequestSchema = z
  .object({
    chainId: lifiSvmChainIdSchema.optional(),
    data: z.string(),
  })
  .passthrough()
  .transform((data) => ({
    ...data,
    chainId:
      data.chainId == null
        ? undefined
        : lifiToSushiChainId(
            data.chainId as XSwapSupportedChainId | typeof LIFI_SOLANA_CHAIN_ID,
          ),
  }))

const lifiTransactionRequestSchema = z.union([
  lifiEvmTransactionRequestSchema,
  lifiSvmTransactionRequestSchema,
])

const lifiStepBaseSchema = z.object({
  id: z.string(),
  type: z.enum(['swap', 'cross', 'lifi', 'protocol']),
  tool: z.string(),
  toolDetails: lifiToolDetailsSchema,
  action: lifiActionSchema,
  estimate: lifiEstimateSchema,
  transactionRequest: lifiTransactionRequestSchema.optional(),
})

const lifiStepSchema = lifiStepBaseSchema.extend({
  includedSteps: z.array(lifiStepBaseSchema),
})

type TransactionRequestWithChainId = {
  transactionRequest?: Record<string, unknown>
  action: { fromChainId: number }
}

function resolveTransactionRequestChainId<
  T extends TransactionRequestWithChainId,
>(data: T): T {
  const { transactionRequest } = data

  if (
    !transactionRequest ||
    typeof transactionRequest !== 'object' ||
    !('chainId' in transactionRequest)
  ) {
    return data
  }

  const chainId = (transactionRequest as { chainId?: number | undefined })
    .chainId

  if (chainId != null) {
    return data
  }

  return {
    ...data,
    transactionRequest: {
      ...transactionRequest,
      chainId: data.action.fromChainId,
    },
  } as T
}

export {
  evmAddressSchema,
  lifiActionSchema,
  lifiChainIdSchema,
  lifiEstimateSchema,
  lifiStepBaseSchema,
  lifiStepSchema,
  lifiTokenSchema,
  lifiToolDetailsSchema,
  lifiTransactionRequestSchema,
  resolveTransactionRequestChainId,
  svmAddressSchema,
}
