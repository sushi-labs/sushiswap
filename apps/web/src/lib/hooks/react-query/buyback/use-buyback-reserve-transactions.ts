import {
  type BuybackReserveTransactions,
  type GetBuybackReserveTransactions,
  getBuybackReserveTransactions,
} from '@sushiswap/graph-client/data-api'
import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { BUYBACK_RESERVE_PARAMS } from './constants'

interface UseBuybackReserveTransactions {
  first?: number
  enabled?: boolean
}

export function useBuybackReserveTransactions({
  first = 52,
  enabled = true,
}: UseBuybackReserveTransactions): UseInfiniteQueryResult<
  InfiniteData<BuybackReserveTransactions>
> {
  return useInfiniteQuery({
    queryKey: ['useBuybackReserveTransactions', first],
    queryFn: ({
      pageParam,
    }: { pageParam: GetBuybackReserveTransactions['after'] }) => {
      return getBuybackReserveTransactions({
        ...BUYBACK_RESERVE_PARAMS,
        first,
        after: pageParam,
      })
    },
    initialPageParam: null,
    enabled: Boolean(enabled),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? (lastPage.endCursor ?? undefined) : undefined,
  })
}
