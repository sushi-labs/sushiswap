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
