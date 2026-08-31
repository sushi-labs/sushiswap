import { z } from 'zod'
import {
  getCrossmintServerEnvironment,
  requestCrossmint,
} from './request-crossmint'
import type {
  CrossmintMoney,
  CrossmintOrder,
  CrossmintOrdersPage,
  ListCrossmintOrdersInput,
} from './types'

const crossmintMoneySchema: z.ZodType<CrossmintMoney> = z.object({
  amount: z.string().min(1),
  currency: z.string().min(1),
})

const crossmintOrderSchema: z.ZodType<CrossmintOrder> = z.object({
  createdAt: z.string().min(1).optional(),
  lineItems: z
    .array(
      z.object({
        chain: z.string().min(1).optional(),
        delivery: z
          .object({
            completedAt: z.string().min(1).optional(),
            recipient: z
              .object({
                locator: z.string().min(1).optional(),
                walletAddress: z.string().min(1).optional(),
              })
              .optional(),
            status: z.string().min(1).optional(),
            tokens: z
              .array(
                z.object({
                  contractAddress: z.string().min(1).optional(),
                  decimals: z.number().int().nonnegative().optional(),
                  locator: z.string().min(1).optional(),
                  mintHash: z.string().min(1).optional(),
                  quantity: z.string().min(1).optional(),
                  symbol: z.string().min(1).optional(),
                  tokenId: z.string().min(1).optional(),
                }),
              )
              .optional(),
            txId: z.string().min(1).optional(),
          })
          .optional(),
        executionMode: z.enum(['exact-in', 'exact-out']).optional(),
        metadata: z
          .object({
            description: z.string().optional(),
            imageUrl: z.string().min(1).optional(),
            name: z.string().min(1).optional(),
          })
          .optional(),
        quantity: z.number().optional(),
        quote: z
          .object({
            status: z.string().min(1).optional(),
            totalPrice: crossmintMoneySchema.optional(),
          })
          .optional(),
      }),
    )
    .optional(),
  locale: z.string().min(1).optional(),
  orderId: z.string().min(1),
  payment: z
    .object({
      currency: z.string().min(1).optional(),
      failureReason: z
        .object({
          code: z.string().min(1).optional(),
          message: z.string().min(1).optional(),
        })
        .optional(),
      method: z.string().min(1).optional(),
      received: crossmintMoneySchema.optional(),
      refunded: crossmintMoneySchema.optional(),
      status: z.string().min(1).optional(),
      totalPaid: crossmintMoneySchema.optional(),
    })
    .optional(),
  phase: z.enum(['quote', 'payment', 'delivery', 'completed']).optional(),
  quote: z
    .object({
      expiresAt: z.string().min(1).optional(),
      quotedAt: z.string().min(1).optional(),
      status: z.string().min(1).optional(),
      totalPrice: crossmintMoneySchema.optional(),
    })
    .optional(),
})

const crossmintOrdersPageSchema = z.object({
  data: z.array(crossmintOrderSchema),
  nextCursor: z
    .string()
    .min(1)
    .nullish()
    .transform((cursor) => cursor ?? undefined),
  previousCursor: z
    .string()
    .min(1)
    .nullish()
    .transform((cursor) => cursor ?? undefined),
})

const listCrossmintOrdersInputSchema = z.object({
  cursor: z.string().trim().min(1).max(2_048).optional(),
  limit: z.number().int().min(1).max(100).default(30),
  recipientAddress: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .max(128)
        .refine((address) => !address.includes(','), 'Invalid wallet address'),
    )
    .min(1)
    .max(20)
    .transform((addresses) => [...new Set(addresses)]),
  sort: z.enum(['asc', 'desc']).default('desc'),
})

export async function fetchCrossmintOrdersPage(
  input: ListCrossmintOrdersInput,
): Promise<CrossmintOrdersPage> {
  const { cursor, limit, recipientAddress, sort } =
    listCrossmintOrdersInputSchema.parse(input)
  const searchParams = new URLSearchParams({
    limit: String(limit),
    recipientAddress: recipientAddress.join(','),
    sort,
  })

  if (cursor) {
    searchParams.set('cursor', cursor)
  }

  const response = await requestCrossmint(
    `/2022-06-09/orders?${searchParams}`,
    'GET',
  )

  return {
    ...crossmintOrdersPageSchema.parse(response),
    environment: getCrossmintServerEnvironment(),
  }
}
