import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { Badge } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { formatPoolFee } from '~stellar/_common/lib/utils/formatters'
import { TokenIcon } from '../General/TokenIcon'

/**
 * Name column that displays token pair with icons and fee badge below
 */
const NAME_COLUMN: ColumnDef<PoolInfo, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => {
    const pool = props.row.original
    return (
      <div className="flex items-center gap-5">
        <div className="flex min-w-[54px]">
          <Badge
            className="border-2 border-slate-900 rounded-full z-[11]"
            position="bottom-right"
            badgeContent={
              <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
            }
          >
            <Currency.IconList iconWidth={26} iconHeight={26}>
              <TokenIcon currency={pool.token0} />
              <TokenIcon currency={pool.token1} />
            </Currency.IconList>
          </Badge>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1 pr-2 text-sm font-medium text-gray-900 dark:text-slate-50 whitespace-nowrap">
            {pool.name}
          </span>
          <div className="bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] px-2 rounded-full w-fit">
            {formatPoolFee(pool.fee)}
          </div>
        </div>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex items-center">
            <SkeletonCircle radius={30} />
            <SkeletonCircle radius={30} className="-ml-[10px]" />
          </div>
          <div className="flex flex-col w-full min-w-[120px] gap-1">
            <SkeletonText fontSize="lg" />
            <SkeletonText fontSize="xs" />
          </div>
        </div>
      ),
    },
  },
}

/**
 * TVL (Total Value Locked) column showing the pool's total value in USD
 */
const TVL_COLUMN: ColumnDef<PoolInfo, unknown> = {
  id: 'tvl',
  header: 'TVL',
  accessorFn: (row) => row.tvl,
  sortingFn: ({ original: rowA }, { original: rowB }) => rowA.tvl - rowB.tvl,
  cell: (props) => {
    const tvl = props.row.original.tvl
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">
          $
          {tvl.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="sm" />,
    },
  },
}

/**
 * Total liquidity column showing the pool's total liquidity
 */
const TOTAL_LIQUIDITY_COLUMN: ColumnDef<PoolInfo, unknown> = {
  id: 'liquidity',
  header: 'Total Liquidity',
  accessorFn: (row) => row.liquidity.formatted,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.liquidity.formatted) - Number(rowB.liquidity.formatted),
  cell: (props) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">
          {props.row.original.liquidity.formatted}
        </span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="sm" />,
    },
  },
}

/**
 * Token0 reserves column showing the first token's reserves
 */
const TOKEN0_RESERVES_COLUMN: ColumnDef<PoolInfo, unknown> = {
  id: 'token0Reserves',
  header: (props) => {
    const pool = props.table.options.data[0] as PoolInfo
    return `Reserves (${pool.reserves.token0.code})`
  },
  accessorFn: (row) => row.reserves.token0.formatted,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.reserves.token0.amount) - Number(rowB.reserves.token0.amount),
  cell: (props) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">
          {props.row.original.reserves.token0.formatted}
        </span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="sm" />,
    },
  },
}

/**
 * Token1 reserves column showing the second token's reserves
 */
const TOKEN1_RESERVES_COLUMN: ColumnDef<PoolInfo, unknown> = {
  id: 'token1Reserves',
  header: (props) => {
    const pool = props.table.options.data[0] as PoolInfo
    return `Reserves (${pool.reserves.token1.code})`
  },
  accessorFn: (row) => row.reserves.token1.formatted,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.reserves.token1.amount) - Number(rowB.reserves.token1.amount),
  cell: (props) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">
          {props.row.original.reserves.token1.formatted}
        </span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="sm" />,
    },
  },
}

/**
 * Fee column showing the pool fee percentage
 */
const FEE_COLUMN: ColumnDef<PoolInfo, unknown> = {
  id: 'fee',
  header: 'Fee',
  accessorFn: (row) => row.fee,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.fee) - Number(rowB.fee),
  cell: (props) => {
    const fee = props.row.original.fee
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">{formatPoolFee(fee)}</span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="sm" />,
    },
  },
}

/**
 * Tick spacing column showing the tick spacing value
 */
const TICK_SPACING_COLUMN: ColumnDef<PoolInfo, unknown> = {
  id: 'spacing',
  header: 'Tick Spacing',
  accessorFn: (row) => row.tickSpacing,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.tickSpacing - rowB.tickSpacing,
  cell: (props) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm font-mono text-gray-600 dark:text-slate-400">
          {props.row.original.tickSpacing}
        </span>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="sm" />,
    },
  },
}

/**
 * Simple columns for basic pool information display
 */
export const SIMPLE_COLUMNS = [
  NAME_COLUMN,
  TVL_COLUMN,
  TOTAL_LIQUIDITY_COLUMN,
  TOKEN0_RESERVES_COLUMN,
  TOKEN1_RESERVES_COLUMN,
  FEE_COLUMN,
  TICK_SPACING_COLUMN,
] satisfies ColumnDef<PoolInfo, unknown>[]
