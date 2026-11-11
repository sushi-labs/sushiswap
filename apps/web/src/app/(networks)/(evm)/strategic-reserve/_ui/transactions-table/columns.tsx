import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { BUYBACK_TOKEN } from 'src/lib/hooks/react-query/buyback'
import type { BuybackReserveTransaction } from 'src/lib/hooks/react-query/buyback/use-buyback-reserve-transactions'
import { perpsNumberFormatter } from 'src/lib/perps/utils'
import { getEvmChainById, shortenHash } from 'sushi/evm'
import { reserveDateFormatter } from '../../_lib/format'

const columnBodyMeta = {
  className: 'tabular-nums !px-4',
  skeleton: <SkeletonText fontSize="sm" />,
}

export const SETTLED_COLUMN: ColumnDef<BuybackReserveTransaction> = {
  id: 'timestamp',
  header: 'Date',
  accessorKey: 'timestamp',
  enableSorting: false,
  size: 240,
  cell: ({ row }) => {
    const timestamp = row.original.timestamp * 1000
    return (
      <time dateTime={new Date(timestamp).toISOString()}>
        <span className="md:whitespace-nowrap">
          {reserveDateFormatter.format(timestamp)}
        </span>
      </time>
    )
  },
  meta: {
    body: {
      className: `${columnBodyMeta.className} !px-6`,
      skeleton: columnBodyMeta.skeleton,
    },
    header: {
      className: 'ml-6',
    },
  },
}

export const RECEIVED_COLUMN: ColumnDef<BuybackReserveTransaction> = {
  id: 'received',
  header: 'SUSHI acquired',
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

export const CUM_ACQUIRED_COLUMN: ColumnDef<BuybackReserveTransaction> = {
  id: 'cummulativeAcquired',
  header: 'Cumulative acquired',
  enableSorting: false,
  size: 190,
  cell: ({ row }) => {
    const received = perpsNumberFormatter({
      value: row.original.cummulativeAcquired,
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
      className="inline-flex max-w-full items-center gap-1 text-muted-foreground hover:text-pink hover:underline"
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
    header: { className: 'text-right !mr-6' },
    body: {
      ...columnBodyMeta,
      className: `${columnBodyMeta.className} text-right !px-6`,
    },
  },
}
