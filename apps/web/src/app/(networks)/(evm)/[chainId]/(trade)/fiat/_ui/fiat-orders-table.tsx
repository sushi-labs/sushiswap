'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import {
  Badge,
  Button,
  Chip,
  ClipboardController,
  DataTableVirtual,
  SkeletonText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useBreakpoint,
} from '@sushiswap/ui'
import { UnknownTokenIcon } from '@sushiswap/ui/icons/unknown-token-icon'
import type { ColumnDef } from '@tanstack/react-table'
import { NetworkIcon } from 'node_modules/@sushiswap/ui/dist/icons/network-icon'
import { useMemo } from 'react'
import { useFiatLocale } from 'src/lib/crossmint'
import { CROSSMINT_CHAIN_NAME_TO_CHAIN_ID } from 'src/lib/crossmint/crossmint-config'
import type { ChainId } from 'sushi'
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
        estimateSize={80}
        loading={isLoading}
        scrollClassName="max-h-[60dvh]"
        skeletonRowCount={5}
        state={{
          pagination: {
            pageIndex: 0,
            pageSize: data.length,
          },
        }}
        testId="fiat-order-history"
        hideScrollbar
      />
    )
  }

  return (
    <MobileTable
      columns={columns}
      data={data}
      isExpandedOverride
      isLoading={isLoading}
      scrollClassName="max-h-[80dvh] overflow-y-auto pr-1"
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
        <div className="flex min-w-24 items-center gap-2.5">
          <OrderTokenIcon
            imageUrl={row.original.tokenImageUrl}
            symbol={row.original.tokenSymbol}
            chainId={
              row.original.network
                ? CROSSMINT_CHAIN_NAME_TO_CHAIN_ID[
                    row.original
                      .network as keyof typeof CROSSMINT_CHAIN_NAME_TO_CHAIN_ID
                  ]
                : undefined
            }
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
      id: 'paymentStatus',
      header: 'Payment status',
      accessorFn: (row) => row.paymentStatus,
      enableSorting: false,
      cell: ({ row }) => (
        <Chip variant={getOrderStatusVariant(row.original.paymentStatus)}>
          {humanizeCrossmintValue(row.original.paymentStatus)}
        </Chip>
      ),
      meta: COLUMN_META,
      size: 130,
    },
    {
      id: 'status',
      header: 'Delivery status',
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
        <span className="block" title={row.original.orderId}>
          <ClipboardController hideTooltip>
            {({ setCopied, isCopied }) => (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="blank"
                      onClick={() => setCopied(row.original.orderId)}
                      className="flex !justify-start items-center !p-0 !h-[unset] !min-h-[unset] leading-none"
                    >
                      {shortenFiatOrderId(row.original.orderId)}
                      {isCopied ? (
                        <CheckIcon className="w-2.5 h-2.5" />
                      ) : (
                        <DocumentDuplicateIcon className="w-2.5 h-2.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{isCopied ? 'Copied!' : 'Copy Address'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </ClipboardController>
        </span>
      ),
      meta: COLUMN_META,
      size: 180,
    },
    {
      id: 'explorer',
      header: 'Transaction',
      accessorFn: (row) => row.explorerUrl,
      enableSorting: false,
      cell: ({ row }) =>
        row.original.explorerUrl ? (
          <a
            aria-label={`View order ${row.original.orderId} transaction on block explorer`}
            className="inline-flex items-center gap-1 font-semibold text-blue hover:underline"
            href={row.original.explorerUrl}
            rel="noreferrer"
            target="_blank"
          >
            View
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span>-</span>
        ),
      meta: {
        ...COLUMN_META,
        disableLink: true,
      },
      size: 110,
    },
  ]
}

function OrderTokenIcon({
  imageUrl,
  symbol,
  chainId,
}: {
  imageUrl: string | undefined
  symbol: string
  chainId: ChainId | undefined
}) {
  return (
    <span className="h-7 w-7">
      <Badge
        className="z-[11] rounded-full border border-slate-900"
        position="bottom-right"
        badgeContent={
          chainId ? (
            <NetworkIcon chainId={chainId} height={14} width={14} />
          ) : (
            <></>
          )
        }
      >
        {imageUrl ? (
          <img
            alt={`${symbol} token`}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
            src={imageUrl}
          />
        ) : (
          <UnknownTokenIcon className="h-full w-full" />
        )}
      </Badge>
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
