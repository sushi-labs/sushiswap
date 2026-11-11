'use client'

import { useIsMounted } from '@sushiswap/hooks'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Chip,
  DataTableVirtual,
  useBreakpoint,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { useBuybackReserveTransactions } from 'src/lib/hooks/react-query/buyback/use-buyback-reserve-transactions'
import { MobileTable } from '~evm/perps/_ui/trade-tables/_common/mobile-table'
import {
  CUM_ACQUIRED_COLUMN,
  RECEIVED_COLUMN,
  SETTLED_COLUMN,
  TRANSACTION_COLUMN,
} from './columns'

const COLUMNS = [
  SETTLED_COLUMN,
  RECEIVED_COLUMN,
  CUM_ACQUIRED_COLUMN,
  TRANSACTION_COLUMN,
]

const MOBILE_COLUMNS = [
  SETTLED_COLUMN,
  RECEIVED_COLUMN,
  CUM_ACQUIRED_COLUMN,
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

  return (
    <Card>
      <CardHeader className="gap-2 px-4 md:px-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle>
          <div className="flex items-start gap-1">
            <span>Buyback history</span>
            <Chip variant="muted" className="!px-1.5 !rounded-full">
              {totalCount}
            </Chip>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="!px-0 bg-background !pb-0">
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
              thClassName="!mx-2 first:!pl-0 last:!pr-0 !h-10 bg-secondary"
              scrollClassName="!border-t-0"
              estimateSize={64}
              testId="reserve-transaction"
              trClassName="!h-10"
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
