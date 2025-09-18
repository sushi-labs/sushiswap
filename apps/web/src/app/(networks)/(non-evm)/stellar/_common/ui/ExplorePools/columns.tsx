import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { formatPercent, formatUSD } from 'sushi/format'
import type { IPool } from '~stellar/_common/lib/hooks/use-pools'
import { PoolNameCell } from './cells/pool-name-cell'

const NAME_COLUMN: ColumnDef<IPool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PoolNameCell row={props.row.original} />,
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

const TVL_COLUMN: ColumnDef<IPool, unknown> = {
  id: 'liquidityUSD',
  header: 'TVL',
  accessorFn: (row) => row.liquidityUSD,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.liquidityUSD - rowB.liquidityUSD,
  cell: (props) =>
    formatUSD(props.row.original.liquidityUSD).includes('NaN')
      ? '$0.00'
      : formatUSD(props.row.original.liquidityUSD),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

const VOLUME_1D_COLUMN: ColumnDef<IPool, unknown> = {
  id: 'volumeUSD1d',
  header: 'Volume (24h)',
  accessorFn: (row) => row.volumeUSD1d,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.volumeUSD1d - rowB.volumeUSD1d,
  cell: (props) =>
    formatUSD(props.row.original.volumeUSD1d).includes('NaN')
      ? '$0.00'
      : formatUSD(props.row.original.volumeUSD1d),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

const FEES_1D_COLUMN: ColumnDef<IPool, unknown> = {
  id: 'feeUSD1d',
  header: 'Fees (24h)',
  accessorFn: (row) => row.feeUSD1d,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.feeUSD1d - rowB.feeUSD1d,
  cell: (props) =>
    formatUSD(props.row.original.feeUSD1d).includes('NaN')
      ? '$0.00'
      : formatUSD(props.row.original.feeUSD1d),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

const TRANSACTIONS_1D_COLUMN: ColumnDef<IPool, unknown> = {
  id: 'txCount1d',
  header: 'Transactions (24h)',
  accessorFn: (row) => row.txCount1d,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.txCount1d - rowB.txCount1d,
  cell: (props) => props.row.original.txCount1d,
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

const APR_COLUMN: ColumnDef<IPool, unknown> = {
  id: 'totalApr1d',
  header: 'APR',
  accessorFn: (row) => row.totalApr1d,
  cell: (props) => formatPercent(props.row.original.totalApr1d),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const COLUMNS = [
  NAME_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  FEES_1D_COLUMN,
  TRANSACTIONS_1D_COLUMN,
  APR_COLUMN,
] satisfies ColumnDef<IPool, unknown>[]
