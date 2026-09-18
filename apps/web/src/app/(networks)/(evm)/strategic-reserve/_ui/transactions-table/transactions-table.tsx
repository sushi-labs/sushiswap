'use client'

import { useIsMounted } from '@sushiswap/hooks'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTableVirtual,
  useBreakpoint,
} from '@sushiswap/ui'
import { MobileTable } from '~evm/perps/_ui/trade-tables/_common/mobile-table'
import { reserveDateFormatter } from '../../_lib/format'
import { mockReserveTransactions } from '../../_lib/mock-data'
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
  const { transactions, totalCount } = mockReserveTransactions
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
        {isMounted && isMd ? (
          <DataTableVirtual
            columns={COLUMNS}
            data={transactions}
            loading={false}
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
            isLoading={false}
            sorting={[]}
            isExpandedOverride
          />
        )}
      </CardContent>
    </Card>
  )
}
