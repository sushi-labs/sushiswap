'use client'

import { useIsMounted } from '@sushiswap/hooks'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTableVirtual,
  useBreakpoint,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { useBuybackReserveTransactions } from 'src/lib/hooks/react-query/buyback/use-buyback-reserve-transactions'
import { MobileTable } from '~evm/perps/_ui/trade-tables/_common/mobile-table'
import { reserveDateFormatter } from '../../_lib/format'
import {
  PRICE_COLUMN,
  RECEIVED_COLUMN,
  ROUND_COLUMN,
  SETTLED_COLUMN,
  SPENT_COLUMN,
  TRANSACTION_COLUMN,
} from './columns'

const COLUMNS = [
  ROUND_COLUMN,
  SETTLED_COLUMN,
  SPENT_COLUMN,
  RECEIVED_COLUMN,
  PRICE_COLUMN,
  TRANSACTION_COLUMN,
]

const MOBILE_COLUMNS = [
  ROUND_COLUMN,
  RECEIVED_COLUMN,
  PRICE_COLUMN,
  SETTLED_COLUMN,
  SPENT_COLUMN,
  TRANSACTION_COLUMN,
]

export function TransactionsTable(): React.ReactElement {
  const isMounted = useIsMounted()
  const { isMd } = useBreakpoint('md')
  const {
    data,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useBuybackReserveTransactions({
    enabled: true,
  })
  const { transactions, totalCount } = useMemo(() => {
    return {
      transactions: data?.pages.flatMap((page) => page.transactions) ?? [],
      totalCount: data?.pages?.[0]?.totalCount ?? 0,
    }
  }, [data])

  const firstTimestamp = transactions.length
    ? Math.min(...transactions.map((transaction) => transaction.timestamp))
    : undefined

  return (
    <Card>
      <CardHeader className="gap-2 px-4 md:px-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle>Buyback rounds</CardTitle>
        <CardDescription>
          {totalCount} rounds
          {firstTimestamp !== undefined &&
            ` since ${reserveDateFormatter.format(firstTimestamp * 1000)}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        {(!isError || data) &&
          (isMounted && isMd ? (
            <DataTableVirtual
              columns={COLUMNS}
              data={transactions}
              loading={isLoading}
              state={{
                pagination: {
                  pageIndex: 0,
                  pageSize: Math.max(transactions.length, 1),
                },
              }}
              thClassName="!px-2 first:!pl-0 last:!pr-0 !h-10"
              scrollClassName="!border-t-0"
              estimateSize={64}
              testId="reserve-transaction"
            />
          ) : (
            <MobileTable
              columns={MOBILE_COLUMNS}
              data={transactions}
              isLoading={isLoading}
              sorting={[]}
              isExpandedOverride
            />
          ))}
        {isError ? (
          <div
            role="alert"
            className="flex min-h-24 flex-col items-center justify-center gap-3 py-4 text-sm"
          >
            <span className="text-red">
              {isFetchNextPageError
                ? 'Unable to load more buyback rounds.'
                : 'Unable to load buyback rounds.'}
            </span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              loading={isFetching}
              onClick={() => {
                if (isFetching) return
                if (isFetchNextPageError) {
                  void fetchNextPage()
                } else {
                  void refetch()
                }
              }}
            >
              Try again
            </Button>
          </div>
        ) : hasNextPage ? (
          <div className="flex justify-center pt-4" aria-live="polite">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isFetching}
              loading={isFetchingNextPage}
              onClick={() => {
                if (!isFetching) void fetchNextPage()
              }}
            >
              {isFetchingNextPage ? 'Loading more rounds…' : 'Load more'}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
