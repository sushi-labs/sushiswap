import { useInfiniteQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { WalletPosition } from '~kadena/_common/types/get-positions'
import { useKadena } from '~kadena/kadena-wallet-provider'

interface WalletPositionsApiResponse {
  success: boolean
  data: {
    positions: WalletPosition[]
    pageInfo: {
      endCursor: string
      hasNextPage: boolean
    }
    totalCount: number
  }
}

export const useMyPositions = (pageSize = 50) => {
  const { activeAccount } = useKadena()
  const walletAddress = activeAccount?.accountName

  return useInfiniteQuery({
    queryKey: ['kadena-wallet-positions', walletAddress],
    queryFn: async ({ pageParam = null }) => {
      const url = new URL('/kadena/api/positions', window.location.origin)
      url.searchParams.set('walletAddress', walletAddress!)
      url.searchParams.set('first', String(pageSize))
      // console.log(
      // 	"Fetching wallet positions for:",
      // 	walletAddress,
      // 	"with page size:",
      // 	pageSize,
      // 	"and pageParam:",
      // 	pageParam
      // );
      if (pageParam) url.searchParams.set('after', pageParam)

      const res = await fetch(url.toString())
      const json: WalletPositionsApiResponse = await res.json()
      if (!json.success) {
        console.error('Failed to fetch wallet positions:', json)
        throw new Error('Failed to fetch wallet positions')
      }

      return json.data
    },
    getNextPageParam: (lastPage: WalletPositionsApiResponse['data']) => {
      const nextParam = lastPage.pageInfo.hasNextPage
        ? lastPage.pageInfo.endCursor
        : undefined

      return nextParam
    },

    select: (data) => {
      const flat = data.pages.flatMap((p) => p.positions)
      return { ...data, positions: flat }
    },
    initialPageParam: null,
    staleTime: ms('10s'),
    enabled: !!walletAddress,
  })
}
