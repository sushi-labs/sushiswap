import * as z from 'zod'

const nearIntentsQuote = z.object({
  amountIn: z.string(),
  amountInUsd: z.string(),
  amountOut: z.string(),
  amountOutUsd: z.string(),
  minAmountOut: z.string(),
  timeEstimate: z.number(),
})

export const nearIntentsQuoteSchema = z.object({
  quote: nearIntentsQuote,
  correlationId: z.string(),
  timestamp: z.string(),
  signature: z.string(),
})

export const nearIntentsSwapSchema = z.object({
  quote: nearIntentsQuote.extend({
    depositAddress: z.string(),
    deadline: z.string(),
    timeWhenInactive: z.string(),
  }),
  correlationId: z.string(),
  timestamp: z.string(),
  signature: z.string(),
})

export const nearIntentsTokenSchema = z.object({
  assetId: z.string(),
  decimals: z.number(),
  blockchain: z.string(),
  symbol: z.string(),
  price: z.number(),
  priceUpdatedAt: z.string(),
  contractAddress: z.optional(z.string()),
})

const transactionDetailsSchema = z.object({
  hash: z.string(),
  explorerUrl: z.string(),
})

const swapDetailsSchema = z.object({
  intentHashes: z.array(z.string()),
  nearTxHashes: z.array(z.string()),
  amountIn: z.string().optional(),
  amountInFormatted: z.string().optional(),
  amountInUsd: z.string().optional(),
  amountOut: z.string().optional(),
  amountOutFormatted: z.string().optional(),
  amountOutUsd: z.string().optional(),
  slippage: z.number().optional(),
  originChainTxHashes: z.array(transactionDetailsSchema),
  destinationChainTxHashes: z.array(transactionDetailsSchema),
  refundedAmount: z.string().optional(),
  refundedAmountFormatted: z.string().optional(),
  refundedAmountUsd: z.string().optional(),
  refundReason: z.string().optional(),
  depositedAmount: z.string().optional(),
  depositedAmountFormatted: z.string().optional(),
  depositedAmountUsd: z.string().optional(),
  referral: z.string().optional(),
})

export const nearIntentsStatusSchema = z.object({
  correlationId: z.string(),
  status: z.enum([
    'KNOWN_DEPOSIT_TX',
    'PENDING_DEPOSIT',
    'INCOMPLETE_DEPOSIT',
    'PROCESSING',
    'SUCCESS',
    'REFUNDED',
    'FAILED',
  ]),
  updatedAt: z.string(),
  quoteResponse: nearIntentsSwapSchema,
  swapDetails: swapDetailsSchema,
})
