import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { formatPercent, formatUSD } from 'sushi'
import type { Pool } from '~kadena/_common/types/get-all-pools-type'
import { PoolNameCell } from './PoolNameCell'

export const NAME_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PoolNameCell data={props.row.original} />,
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex items-center">
            <SkeletonCircle radius={30} />
            <SkeletonCircle radius={30} className="-ml-[10px]" />
          </div>
          <div className="flex flex-col w-full min-w-[120px]">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
  },
}

export const TVL_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'liquidityUSD',
  header: 'TVL',
  accessorFn: (row) => row.tvlUsd,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.tvlUsd - rowB.tvlUsd,
  cell: (props) => {
    const raw = Number(props.row.original.tvlUsd)
    const tvl = Number.isNaN(raw) ? 0 : raw

    return formatUSD(tvl)
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const VOLUME_1D_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'volumeUSD1d',
  header: 'Volume (24h)',
  accessorFn: (row) => row.volume24hUsd,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.volume24hUsd - rowB.volume24hUsd,
  cell: (props) => {
    const raw = Number(props.row.original.volume24hUsd)
    const volume24hUsd = Number.isNaN(raw) ? 0 : raw

    return formatUSD(volume24hUsd)
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const FEES_1D_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'feeUSD1d',
  header: 'Fees (24h)',
  accessorFn: (row) => row.fees24hUsd,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.fees24hUsd - rowB.fees24hUsd,
  cell: (props) => {
    const raw = Number(props.row.original.fees24hUsd)
    const fees24hUsd = Number.isNaN(raw) ? 0 : raw

    return formatUSD(fees24hUsd)
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const TRANSACTIONS_1D_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'txCount1d',
  header: 'Transactions (24h)',
  accessorFn: (row) => row.transactionCount24h,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.transactionCount24h - rowB.transactionCount24h,
  cell: (props) => props.row.original.transactionCount24h,
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const APR_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'totalApr1d',
  header: 'APR',
  accessorFn: (row) => row.apr24h,
  cell: (props) => formatPercent(props.row.original.apr24h / 100),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}
