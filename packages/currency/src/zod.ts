import z from 'zod'

export const nativeSchema = z.object({
  isNative: z.literal(true),
  name: z.string().optional(),
  symbol: z.string().optional(),
  decimals: z.number(),
  chainId: z.number(),
})

export const tokenSchema = z.object({
  isNative: z.literal(false),
  name: z.string().optional(),
  symbol: z.string().optional(),
  decimals: z.number(),
  chainId: z.number(),
  address: z.string(),
})

export const amountSchema = z.object({
  amount: z.string(),
  currency: z.discriminatedUnion('isNative', [nativeSchema, tokenSchema]),
})

export type SerializedNative = z.infer<typeof nativeSchema>
export type SerializedToken = z.infer<typeof tokenSchema>
export type SerializedAmount = z.infer<typeof amountSchema>
