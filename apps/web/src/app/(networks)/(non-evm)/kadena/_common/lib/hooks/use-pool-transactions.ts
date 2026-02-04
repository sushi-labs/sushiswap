import type { PoolTransactionType } from '@sushiswap/graph-client/kadena'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import * as z from 'zod'

export const transactionsResponseSchema = z.object({
  edges: z
    .array(
      z.object({
        node: z.object({
          transactionType: z.enum([
            'SWAP',
            'ADD_LIQUIDITY',
            'REMOVE_LIQUIDITY',
          ]),
          transactionId: z.number(),
          timestamp: z.string(),
          requestkey: z.string(),
          maker: z.string(),
          id: z.string(),
          amountUsd: z.string(),
          amount1Out: z.string(),
          amount1In: z.string(),
          amount0Out: z.string(),
          amount0In: z.string(),
        }),
        cursor: z.string(),
      }),
    )
    .default([]),
  pageInfo: z.object({
    hasNextPage: z.boolean(),
    endCursor: z.string().nullable(),
  }),
  totalCount: z.number(),
})

export type PoolTransaction = z.infer<
  typeof transactionsResponseSchema
>['edges'][number]['node']

export const usePoolTransactions = ({
  pairId,
  type,
  pageSize = 10,
}: {
  pairId: string | undefined
  type: PoolTransactionType
  pageSize?: number
}) => {
  return useQuery({
    queryKey: ['kadena-pool-transactions', pairId, type, pageSize],
    queryFn: async () => {
      if (!pairId) {
        throw new Error('Pair ID is required')
      }

      const url = new URL('/kadena/api/pools/txs', window.location.origin)
      url.searchParams.set('pairId', pairId)
      url.searchParams.set('type', type)
      url.searchParams.set('first', String(pageSize))

      const res = await fetch(url.toString())
      const data = await res.json()

      const parsed = transactionsResponseSchema.safeParse(data)

      if (!parsed.success) {
        throw new Error('Failed to parse transactions response')
      }

      return {
        transactions:
          parsed?.data?.edges
            ?.map((e) => e?.node)
            ?.filter((i) => Boolean(i?.maker)) ?? [],
        pageInfo: parsed?.data?.pageInfo,
        totalCount: parsed?.data?.totalCount,
      }
    },
    enabled: Boolean(pairId),
    staleTime: ms('10s'),
  })
}
