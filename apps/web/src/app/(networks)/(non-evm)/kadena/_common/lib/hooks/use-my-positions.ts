import type {
  GetWalletPositionsResponse,
  WalletPosition,
} from '@sushiswap/graph-client/kadena'
import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useCallback } from 'react'
import * as z from 'zod'
import { useKadena } from '~kadena/kadena-wallet-provider'

const walletPositionsResponseSchema = z.object({
  totalCount: z.number(),
  pageInfo: z.object({
    endCursor: z.string().nullable(),
    hasNextPage: z.boolean(),
  }),
  edges: z
    .array(
      z.object({
        node: z.object({
          apr24h: z.number(),
          valueUsd: z.number().nullable(),
          liquidity: z.string(),
          pair: z.object({
            totalSupply: z.string(),
            tvlUsd: z.number(),
            token1: z.object({
              name: z.string(),
              id: z.string(),
              chainId: z.string(),
              address: z.string(),
            }),
            token0: z.object({
              name: z.string(),
              id: z.string(),
              chainId: z.string(),
              address: z.string(),
            }),
            reserve1: z.string(),
            reserve0: z.string(),
            id: z.string(),
            address: z.string(),
          }),
          pairId: z.string(),
          id: z.string(),
        }),
      }),
    )
    .default([]),
})

export const useMyPositions = (pageSize = 50) => {
  const { activeAccount } = useKadena()
  const walletAddress = activeAccount?.accountName

  const select = useCallback(
    (
      data: InfiniteData<
        {
          positions: WalletPosition[] | []
          pageInfo: GetWalletPositionsResponse['pageInfo']
          totalCount: GetWalletPositionsResponse['totalCount']
        },
        string | null
      >,
    ) => {
      const flat = data.pages.flatMap((p) => p?.positions)
      return { ...data, positions: flat }
    },
    [],
  )

  return useInfiniteQuery({
    queryKey: ['kadena-wallet-positions', walletAddress],
    queryFn: async ({ pageParam = null }: { pageParam: string | null }) => {
      if (!walletAddress) {
        return {
          positions: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: '',
          },
          totalCount: 0,
        }
      }

      const url = new URL('/kadena/api/user', window.location.origin)
      url.searchParams.set('walletAddress', walletAddress)
      url.searchParams.set('pageSize', String(pageSize))
      if (pageParam) {
        url.searchParams.set('pageParam', pageParam)
      }
      const res = await fetch(url.toString())
      const data = await res.json()

      const parsed = walletPositionsResponseSchema.safeParse(data)

      if (!parsed.success) {
        throw new Error('Failed to parse positions response')
      }

      return {
        positions: parsed?.data?.edges?.map((edge) => edge?.node),
        pageInfo: parsed?.data?.pageInfo ?? {},
        totalCount: parsed?.data?.totalCount ?? 0,
      }
    },
    getNextPageParam: (lastPage) => {
      const nextParam = lastPage?.pageInfo?.hasNextPage
        ? lastPage.pageInfo.endCursor
        : undefined

      return nextParam
    },
    select,
    initialPageParam: null,
    staleTime: ms('10s'),
    enabled: Boolean(walletAddress),
  })
}
