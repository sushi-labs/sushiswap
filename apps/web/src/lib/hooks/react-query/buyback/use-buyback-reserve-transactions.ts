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
import { Amount } from 'sushi'
import { BUYBACK_RESERVE_PARAMS, BUYBACK_TOKEN } from './constants'

interface UseBuybackReserveTransactions {
  first?: number
  enabled?: boolean
}

export type BuybackReserveTransaction =
  BuybackReserveTransactions['transactions'][number] & {
    cummulativeAcquired: string
  }

interface BuybackReserveTransactionsWithCumulative
  extends BuybackReserveTransactions {
  transactions: BuybackReserveTransaction[]
}

export function useBuybackReserveTransactions({
  first = 52,
  enabled = true,
}: UseBuybackReserveTransactions): UseInfiniteQueryResult<
  InfiniteData<BuybackReserveTransactionsWithCumulative>
> {
  return useInfiniteQuery({
    queryKey: ['useBuybackReserveTransactions', first],
    queryFn: async ({
      pageParam,
    }: { pageParam: GetBuybackReserveTransactions['after'] }) => {
      const data = await getBuybackReserveTransactions({
        ...BUYBACK_RESERVE_PARAMS,
        first,
        after: pageParam,
      })
      let cumulativeAcquired = 0n
      const transactions = [...data.transactions]
        .reverse()
        .map((transaction) => {
          cumulativeAcquired += BigInt(transaction.receivedRaw)
          return {
            ...transaction,
            cummulativeAcquired: new Amount(
              BUYBACK_TOKEN,
              cumulativeAcquired,
            ).toString(),
          }
        })
        .reverse()
      return {
        ...data,
        transactions,
      }
    },
    initialPageParam: null,
    enabled: Boolean(enabled),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? (lastPage.endCursor ?? undefined) : undefined,
  })
}
