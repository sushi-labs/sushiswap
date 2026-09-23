import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import type { BuybackReserveTransaction } from '@sushiswap/graph-client/data-api'
import { Chip, SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { BUYBACK_TOKEN } from 'src/lib/hooks/react-query/buyback'
import { perpsNumberFormatter } from 'src/lib/perps/utils'
import { getEvmChainById, shortenHash } from 'sushi/evm'
import { reserveDateFormatter, reserveTimeFormatter } from '../../_lib/format'

const columnBodyMeta = {
  className: 'tabular-nums !px-2 first:!pl-0 last:!pr-0',
  skeleton: <SkeletonText fontSize="sm" />,
}

export const ROUND_COLUMN: ColumnDef<BuybackReserveTransaction> = {
  id: 'round',
  header: 'Round',
  accessorKey: 'round',
  enableSorting: false,
  size: 70,
  cell: ({ row }) => (
    <Chip variant="secondary" className="inline-flex rounded-full">
      #{row.original.round}
    </Chip>
  ),
  meta: { body: columnBodyMeta },
}

export const SETTLED_COLUMN: ColumnDef<BuybackReserveTransaction> = {
  id: 'timestamp',
  header: 'Settled',
  accessorKey: 'timestamp',
  enableSorting: false,
  size: 240,
  cell: ({ row }) => {
    const timestamp = row.original.timestamp * 1000
    return (
      <time dateTime={new Date(timestamp).toISOString()}>
        <span className="md:whitespace-nowrap">
          {reserveDateFormatter.format(timestamp)}
        </span>{' '}
        <span className="block whitespace-nowrap text-muted-foreground xl:inline">
          {reserveTimeFormatter.format(timestamp)} UTC
        </span>
      </time>
    )
  },
  meta: { body: columnBodyMeta },
}

export const SPENT_COLUMN: ColumnDef<BuybackReserveTransaction> = {
  id: 'spent',
  header: 'Spent',
  enableSorting: false,
  size: 170,
  cell: ({ row }) => (
    <div className="flex flex-col gap-1">
      {row.original.spent.map((spent) => (
        <span key={spent.token.id}>
          {perpsNumberFormatter({
            value: spent.amount,
            minFraxDigits: 2,
            maxFraxDigits: 2,
          })}{' '}
          <span className="text-muted-foreground">{spent.token.symbol}</span>
        </span>
      ))}
    </div>
  ),
  meta: { body: columnBodyMeta },
}

export const RECEIVED_COLUMN: ColumnDef<BuybackReserveTransaction> = {
  id: 'received',
  header: 'Received',
  enableSorting: false,
  size: 190,
  cell: ({ row }) => {
    const received = perpsNumberFormatter({
      value: row.original.received,
      minFraxDigits: 4,
      maxFraxDigits: 4,
    })
    return (
      <span>
        <span className="block truncate md:inline" title={received}>
          {received}
        </span>{' '}
        <span className="text-muted-foreground">{BUYBACK_TOKEN.symbol}</span>
      </span>
    )
  },
  meta: { body: columnBodyMeta },
}

export const PRICE_COLUMN: ColumnDef<BuybackReserveTransaction> = {
  id: 'priceUSD',
  header: 'Price',
  enableSorting: false,
  size: 110,
  cell: ({ row }) => (
    <span>
      $
      {perpsNumberFormatter({
        value: row.original.priceUSD || 0,
        minFraxDigits: 5,
        maxFraxDigits: 5,
      })}
    </span>
  ),
  meta: { body: columnBodyMeta },
}

export const TRANSACTION_COLUMN: ColumnDef<BuybackReserveTransaction> = {
  id: 'transactionHash',
  header: 'Transaction',
  enableSorting: false,
  size: 160,
  cell: ({ row }) => (
    <a
      href={getEvmChainById(BUYBACK_TOKEN.chainId).getTransactionUrl(
        row.original.transactionHash as `0x${string}`,
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View transaction for round ${row.original.round} on Etherscan`}
      className="inline-flex max-w-full items-center gap-1 text-muted-foreground hover:text-blue hover:underline"
    >
      <span className="truncate">
        {shortenHash(row.original.transactionHash)}
      </span>
      <ArrowTopRightOnSquareIcon
        className="h-3.5 w-3.5 shrink-0"
        aria-hidden="true"
      />
    </a>
  ),
  meta: {
    header: { className: 'text-right' },
    body: {
      ...columnBodyMeta,
      className: `${columnBodyMeta.className} text-right`,
    },
  },
}
