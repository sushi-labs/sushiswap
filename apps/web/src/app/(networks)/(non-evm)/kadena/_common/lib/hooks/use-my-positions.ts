import {
  type GetWalletPositionsResponse,
  getWalletPositions,
} from '@sushiswap/graph-client/kadena'
import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useCallback } from 'react'
import { useKadena } from '~kadena/kadena-wallet-provider'

export const useMyPositions = (pageSize = 50) => {
  const { activeAccount } = useKadena()
  const walletAddress = activeAccount?.accountName

  const select = useCallback(
    (
      data: InfiniteData<
        {
          positions: GetWalletPositionsResponse['edges'][number]['node'][] | []
          pageInfo: {
            endCursor: string
            hasNextPage: boolean
          }
          totalCount: number
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
      const data = await getWalletPositions({
        walletAddress,
        first: pageSize,
        after: pageParam ?? undefined,
      })

      return {
        positions: data?.edges?.map((edge) => edge?.node),
        pageInfo: data?.pageInfo ?? {},
        totalCount: data?.totalCount ?? 0,
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
    enabled: !!walletAddress,
  })
}
