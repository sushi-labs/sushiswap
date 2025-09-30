import { type XSwapSupportedChainId, isXSwapSupportedChainId } from 'src/config'
import { sz } from 'sushi'
import { type Hex, hexToBigInt } from 'viem'
import { z } from 'zod'

const XSwapChainIdSchema = z.coerce
  .number()
  .refine((chainId) => isXSwapSupportedChainId(chainId), {
    message: 'chainId must exist in XSwapSupportedChainId',
  })
  .transform((chainId) => chainId as XSwapSupportedChainId)

export const crossChainTokenSchema = z.object({
  address: sz.evm.address(),
  decimals: z.number(),
  symbol: z.string(),
  chainId: XSwapChainIdSchema,
  name: z.string(),
  priceUSD: z.string(),
})

export const crossChainActionSchema = z.object({
  fromChainId: XSwapChainIdSchema,
  fromAmount: z.string().transform((amount) => BigInt(amount)),
  fromToken: crossChainTokenSchema,
  toChainId: XSwapChainIdSchema,
  toToken: crossChainTokenSchema,
  slippage: z.number(),
  fromAddress: sz.evm.address().optional(),
  toAddress: sz.evm.address().optional(),
})

export const crossChainEstimateSchema = z.object({
  tool: z.string(),
  fromAmount: z.string().transform((amount) => BigInt(amount)),
  toAmount: z.string().transform((amount) => BigInt(amount)),
  toAmountMin: z.string().transform((amount) => BigInt(amount)),
  approvalAddress: sz.evm.address(),
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
  chainId: XSwapChainIdSchema,
  data: sz.hex(),
  from: sz.evm.address(),
  gasLimit: sz.hex().transform((gasLimit: Hex) => hexToBigInt(gasLimit)),
  gasPrice: sz.hex().transform((gasPrice: Hex) => hexToBigInt(gasPrice)),
  to: sz.evm.address(),
  value: sz.hex().transform((value: Hex) => hexToBigInt(value)),
})

const _crossChainStepSchema = z.object({
  id: z.string(),
  type: z.enum(['swap', 'cross', 'lifi', 'protocol']),
  tool: z.string(),
  toolDetails: crossChainToolDetailsSchema,
  action: crossChainActionSchema,
  estimate: crossChainEstimateSchema,
  transactionRequest: crossChainTransactionRequestSchema.optional(),
})

export const crossChainStepSchema = _crossChainStepSchema.extend({
  includedSteps: z.array(_crossChainStepSchema),
})

export const crossChainRouteSchema = z
  .object({
    id: z.string(),
    fromChainId: XSwapChainIdSchema,
    fromAmount: z.string().transform((amount) => BigInt(amount)),
    fromToken: crossChainTokenSchema,
    toChainId: XSwapChainIdSchema,
    toAmount: z.string().transform((amount) => BigInt(amount)),
    toAmountMin: z.string().transform((amount) => BigInt(amount)),
    toToken: crossChainTokenSchema,
    gasCostUSD: z.string(),
    steps: z.array(
      crossChainStepSchema.transform((data) => {
        return {
          ...data,
          includedStepsWithoutFees: data.includedSteps.filter(
            (step) => step.tool !== 'feeCollection',
          ),
        }
      }),
    ),
    tags: z.array(z.string()).optional(),
    transactionRequest: crossChainTransactionRequestSchema.optional(),
  })
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
