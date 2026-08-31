'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import {
  Chip,
  DataTableVirtual,
  SkeletonText,
  useBreakpoint,
} from '@sushiswap/ui'
import { UnknownTokenIcon } from '@sushiswap/ui/icons/unknown-token-icon'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useFiatLocale } from 'src/lib/crossmint'
import { MobileTable } from '~evm/perps/_ui/trade-tables/_common'

import {
  type FiatOrderHistoryRow,
  formatFiatOrderMoney,
  formatFiatOrderNumber,
  formatFiatOrderTimestamp,
  humanizeCrossmintValue,
  shortenFiatOrderId,
} from './fiat-order-history'

interface FiatOrdersTableProps {
  data: FiatOrderHistoryRow[]
  isLoading: boolean
}

const COLUMN_META = {
  body: {
    className: 'whitespace-nowrap',
    skeleton: <SkeletonText className="min-w-20" fontSize="sm" />,
  },
}

export function FiatOrdersTable({ data, isLoading }: FiatOrdersTableProps) {
  const { isMd } = useBreakpoint('md')
  const locale = useFiatLocale()
  const columns = useMemo(() => getFiatOrderColumns(locale), [locale])

  if (isMd) {
    return (
      <DataTableVirtual
        columns={columns}
        data={data}
        estimateSize={76}
        loading={isLoading}
        overscan={8}
        scrollClassName="max-h-[55dvh]"
        skeletonRowCount={5}
        testId="fiat-order-history"
      />
    )
  }

  return (
    <MobileTable
      columns={columns}
      data={data}
      isExpandedOverride
      isLoading={isLoading}
      scrollClassName="max-h-[55dvh] overflow-y-auto pr-1"
      sorting={[]}
    />
  )
}

function getFiatOrderColumns(
  locale: string,
): ColumnDef<FiatOrderHistoryRow, unknown>[] {
  return [
    {
      id: 'token',
      header: 'Token',
      accessorFn: (row) => row.tokenSymbol,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex min-w-24 items-center gap-2">
          <OrderTokenIcon
            imageUrl={row.original.tokenImageUrl}
            symbol={row.original.tokenSymbol}
          />
          <span className="font-semibold">
            {row.original.tokenSymbol?.toUpperCase()}
          </span>
        </div>
      ),
      meta: COLUMN_META,
      size: 120,
    },
    {
      id: 'tokenAmount',
      header: 'Bought',
      accessorFn: (row) => row.tokenAmount,
      enableSorting: false,
      cell: ({ row }) => (
        <span>
          {formatFiatOrderNumber(row.original.tokenAmount, locale)}{' '}
          {row.original.tokenAmount
            ? row.original.tokenSymbol?.toUpperCase()
            : ''}
        </span>
      ),
      meta: COLUMN_META,
      size: 140,
    },
    {
      id: 'fiatAmount',
      header: 'Paid',
      accessorFn: (row) => row.fiatAmount?.amount,
      enableSorting: false,
      cell: ({ row }) => (
        <span>
          {formatFiatOrderMoney(
            row.original.fiatAmount,
            row.original.fiatCurrency,
            locale,
          )}
        </span>
      ),
      meta: COLUMN_META,
      size: 140,
    },

    {
      id: 'status',
      header: 'Status',
      accessorFn: (row) => row.status,
      enableSorting: false,
      cell: ({ row }) => (
        <Chip variant={getOrderStatusVariant(row.original.status)}>
          {humanizeCrossmintValue(row.original.status)}
        </Chip>
      ),
      meta: COLUMN_META,
      size: 130,
    },
    {
      id: 'timestamp',
      header: 'Date',
      accessorFn: (row) => row.timestamp,
      enableSorting: false,
      cell: ({ row }) => (
        <span>{formatFiatOrderTimestamp(row.original.timestamp, locale)}</span>
      ),
      meta: COLUMN_META,
      size: 170,
    },
    {
      id: 'orderId',
      header: 'Order ID',
      accessorFn: (row) => row.orderId,
      enableSorting: false,
      cell: ({ row }) => (
        <span className="block max-w-36 truncate" title={row.original.orderId}>
          {shortenFiatOrderId(row.original.orderId)}
        </span>
      ),
      meta: COLUMN_META,
      size: 150,
    },
  ]
}

function OrderTokenIcon({
  imageUrl,
  symbol,
}: {
  imageUrl: string | undefined
  symbol: string
}) {
  return (
    <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-secondary">
      <UnknownTokenIcon className="h-full w-full" />
      {imageUrl ? (
        <img
          alt={`${symbol} token`}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
          src={imageUrl}
        />
      ) : null}
    </span>
  )
}

function getOrderStatusVariant(
  status: string,
): 'blue' | 'green' | 'red' | 'secondary' {
  const normalized = status.toLowerCase()

  if (/completed|delivered|succeeded/.test(normalized)) return 'green'
  if (/cancelled|declined|expired|failed|refunded/.test(normalized))
    return 'red'
  if (
    /awaiting|pending|progress|payment|quote|verification|kyc/.test(normalized)
  ) {
    return 'blue'
  }

  return 'secondary'
}
