import { isXSwapSupportedChainId } from 'src/config'
import { hexToBigInt, isAddress, isHex } from 'viem'
import { z } from 'zod'

export const crossChainTokenSchema = z.object({
  address: z.string().refine((address) => isAddress(address), {
    message: 'address does not conform to Address',
  }),
  decimals: z.number(),
  symbol: z.string(),
  chainId: z.number().refine((chainId) => isXSwapSupportedChainId(chainId), {
    message: `chainId must exist in XSwapChainId`,
  }),
  name: z.string(),
  priceUSD: z.string(),
})

export const crossChainActionSchema = z.object({
  fromChainId: z
    .number()
    .refine((chainId) => isXSwapSupportedChainId(chainId), {
      message: `fromChainId must exist in XSwapChainId`,
    }),
  fromAmount: z.string().transform((amount) => BigInt(amount)),
  fromToken: crossChainTokenSchema,
  toChainId: z.number().refine((chainId) => isXSwapSupportedChainId(chainId), {
    message: `toChainId must exist in XSwapChainId`,
  }),
  toToken: crossChainTokenSchema,
  slippage: z.number(),
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
})

export const crossChainEstimateSchema = z.object({
  tool: z.string(),
  fromAmount: z.string().transform((amount) => BigInt(amount)),
  toAmount: z.string().transform((amount) => BigInt(amount)),
  toAmountMin: z.string().transform((amount) => BigInt(amount)),
  approvalAddress: z.string().refine((address) => isAddress(address), {
    message: 'approvalAddress does not conform to Address',
  }),
  feeCosts: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        percentage: z.string(),
        token: crossChainTokenSchema,
        amount: z.string().transform((amount) => BigInt(amount)),
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
      amount: z.string().transform((amount) => BigInt(amount)),
      amountUSD: z.string(),
      token: crossChainTokenSchema,
    }),
  ),
  executionDuration: z.number(),
})

export const crossChainToolDetailsSchema = z.object({
  key: z.string(),
  name: z.string(),
  logoURI: z.string(),
})

export const crossChainTransactionRequestSchema = z.object({
  chainId: z.number().refine((chainId) => isXSwapSupportedChainId(chainId), {
    message: `chainId must exist in XSwapChainId`,
  }),
  data: z.string().refine((data) => isHex(data), {
    message: 'data does not conform to Hex',
  }),
  from: z.string().refine((from) => isAddress(from), {
    message: 'from does not conform to Address',
  }),
  gasLimit: z
    .string()
    .refine((gasLimit) => isHex(gasLimit), {
      message: 'gasLimit does not conform to Hex',
    })
    .transform((gasLimit) => hexToBigInt(gasLimit)),
  gasPrice: z
    .string()
    .refine((gasPrice) => isHex(gasPrice), {
      message: 'gasPrice does not conform to Hex',
    })
    .transform((gasPrice) => hexToBigInt(gasPrice)),
  to: z.string().refine((to) => isAddress(to), {
    message: 'to does not conform to Address',
  }),
  value: z
    .string()
    .refine((value) => isHex(value), {
      message: 'value does not conform to Hex',
    })
    .transform((value) => hexToBigInt(value)),
})

const _crossChainStepSchema = z.object({
  id: z.string(),
  type: z.enum(['swap', 'cross', 'lifi']),
  tool: z.string(),
  toolDetails: crossChainToolDetailsSchema,
  action: crossChainActionSchema,
  estimate: crossChainEstimateSchema,
  transactionRequest: crossChainTransactionRequestSchema.optional(),
})

export const crossChainStepSchema = _crossChainStepSchema.extend({
  includedSteps: z.array(_crossChainStepSchema),
})

export const crossChainRouteSchema = z.object({
  id: z.string(),
  fromChainId: z.coerce
    .number()
    .refine((chainId) => isXSwapSupportedChainId(chainId), {
      message: `fromChainId must exist in XSwapChainId`,
    }),
  fromAmount: z.string().transform((amount) => BigInt(amount)),
  fromToken: crossChainTokenSchema,
  toChainId: z.coerce
    .number()
    .refine((chainId) => isXSwapSupportedChainId(chainId), {
      message: `toChainId must exist in XSwapChainId`,
    }),
  toAmount: z.string().transform((amount) => BigInt(amount)),
  toAmountMin: z.string().transform((amount) => BigInt(amount)),
  toToken: crossChainTokenSchema,
  gasCostUSD: z.string(),
  steps: z.array(crossChainStepSchema),
  transactionRequest: crossChainTransactionRequestSchema.optional(),
})
