import {
  Currency,
  SkeletonBox,
  SkeletonCircle,
  SkeletonText,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef } from '@tanstack/react-table'
import { type EvmChainId, evmChains, formatNumber, formatUSD } from 'sushi'
import type { Native } from 'sushi/currency'
import { formatPercent } from 'sushi/format'
import { MiniChart } from './mini-chart'
import type { PortfolioRow } from './wallet-holdings'

export const CHAIN_COLUMN: ColumnDef<PortfolioRow> = {
  id: 'chain',
  header: () => (
    <span className="text-slate-450 dark:text-slate-500">Chain</span>
  ),
  enableSorting: false,
  accessorFn: (row) => row.chainId,
  cell: ({ row }) => (
    <div className="flex gap-1 md:gap-2">
      <div className="dark:border-[#222137] ml-auto border-[#F5F5F5] border rounded-[4px] overflow-hidden">
        <NetworkIcon
          type="square"
          chainId={row.original.chainId}
          className="w-5 h-5"
        />
      </div>
    </div>
  ),
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-5 h-5 rounded-sm" />,
    },
  },
}

// assets
export const ASSETS_COLUMN: ColumnDef<PortfolioRow> = {
  id: 'assets',
  header: () => (
    <div className="flex gap-1 items-center">
      <span className="text-slate-450 dark:text-slate-500">Assets</span>
      <div className="px-2 py-1 text-xs rounded-lg bg-slate-200 dark:bg-slate-750 text-slate-450 dark:text-slate-500">
        {formatPercent(1)}
      </div>
    </div>
  ),
  enableSorting: false,
  accessorFn: (row) => row,
  cell: ({ row }) => {
    return (
      <div className="flex items-center gap-1 md:gap-2 min-w-[130px]">
        <Currency.Icon
          disableLink
          currency={row.original.token}
          width={24}
          height={24}
        />{' '}
        <span className="flex gap-1 items-center whitespace-nowrap text-slate-900 dark:text-slate-200">
          {row.original.token.symbol}
          <div className="px-2 py-1 text-xs rounded-lg bg-slate-200 dark:bg-slate-750 text-slate-450 dark:text-slate-500">
            {formatPercent(row.original.percentageOfPort)}
          </div>
        </span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex gap-1 items-center">
          <SkeletonCircle radius={24} className="w-6 h-6" />
          <SkeletonBox className="w-[60px] h-4 rounded-sm" />
        </div>
      ),
    },
  },
}

// price
export const PRICE_COLUMN: ColumnDef<PortfolioRow> = {
  id: 'price',
  header: () => (
    <span className="font-semibold text-slate-450 dark:text-slate-500">
      Price
    </span>
  ),
  accessorFn: (row) => row.price,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.price - rowB.price,
  cell: (props) =>
    formatUSD(props.row.original.price).includes('NaN')
      ? '$0.00'
      : formatUSD(props.row.original.price),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

// amount
export const AMOUNT_COLUMN: ColumnDef<PortfolioRow> = {
  id: 'amount',
  header: () => (
    <span className="font-semibold text-slate-450 dark:text-slate-500">
      Amount
    </span>
  ),
  accessorFn: (row) => row,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.amount - rowB.amount,
  cell: ({ row }) => {
    return (
      <div className="flex items-center gap-1 md:gap-2 min-w-[130px]">
        <span className="whitespace-nowrap">
          {formatNumber(row.original.amount)} {row.original.token.symbol}
        </span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex gap-1 items-center">
          <SkeletonCircle radius={24} className="w-6 h-6" />
          <SkeletonBox className="w-[60px] h-4 rounded-sm" />
        </div>
      ),
    },
  },
}

// value
export const VALUE_COLUMN: ColumnDef<PortfolioRow> = {
  id: 'value',
  header: () => (
    <span className="font-semibold text-slate-450 dark:text-slate-500">
      Value
    </span>
  ),
  accessorFn: (row) => row.value,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.value - rowB.value,
  cell: (props) =>
    formatUSD(props.row.original.value).includes('NaN')
      ? '$0.00'
      : formatUSD(props.row.original.value),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

// unpnl
export const UPNL_COLUMN: ColumnDef<PortfolioRow> = {
  id: 'uPnL',
  header: () => (
    <span className="font-semibold text-slate-450 dark:text-slate-500">
      uPnL
    </span>
  ),
  accessorFn: (row) => row.uPnL,
  sortingFn: ({ original: a }, { original: b }) =>
    Number(a.uPnL) - Number(b.uPnL),
  cell: ({ row }) => {
    return (
      <div className="flex gap-1 items-center font-medium md:items-start md:flex-col">
        <span
          className={
            row.original.uPnL > 0
              ? 'text-green-500'
              : row.original.uPnL < 0
                ? 'text-red'
                : 'text-muted-foreground'
          }
        >
          {row.original.uPnL > 0 ? '+' : ''}
          {formatUSD(row.original.uPnL)}
        </span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex flex-col gap-1">
          <SkeletonBox className="w-[60px] h-4 rounded-sm" />
          <SkeletonBox className="w-[50px] h-3 rounded-sm" />
        </div>
      ),
    },
  },
}

// last 30 day

export const LAST_30_DAY_COLUMN: ColumnDef<PortfolioRow> = {
  id: 'last30Days',
  header: () => (
    <span className="font-semibold text-slate-450 dark:text-slate-500">
      Last 30 Days
    </span>
  ),
  enableSorting: false,
  accessorFn: (row) => row.last30Days,
  cell: ({ row }) => {
    const { last30Days, price } = row.original

    if (!last30Days) return null

    const xData = last30Days.map((p) => p.timestamp)
    const yData = last30Days.map((p) => p.price)

    return (
      <MiniChart
        xData={xData}
        yData={yData}
        color={
          price > 0
            ? '#1DA67D' // green-500
            : price < 0
              ? '#DE5852' // red-500
              : '#94a3b8' // slate-400
        }
      />
    )
  },
  meta: {
    body: {
      skeleton: <div className="w-[212px] h-[40px]" />,
    },
  },
}
