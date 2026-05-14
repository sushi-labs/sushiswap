import { classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import {
  type PerpsVault,
  currencyFormatter,
  getTextColorClass,
} from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { formatPercent, truncateString } from 'sushi'
import { columnBodyMeta } from '~evm/perps/_ui/trade-tables/_common/column-meta'
import {
  TIMEFRAME_TO_PNL_KEY,
  useUserVaultsState,
} from './user-vaults-provider'

export const NAME_COLUMN: ColumnDef<PerpsVault, unknown> = {
  id: 'vaultName',
  header: 'Vault',
  accessorFn: (row) => row.summary.name,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const vault = props.row.original.summary
    const isClosed = vault.isClosed
    return (
      <div
        className={classNames(
          'font-medium flex items-center whitespace-nowrap gap-1 min-w-[250px]',
          isClosed ? 'text-gray-500' : '',
        )}
      >
        {vault.name}
        {isClosed ? (
          <span className="text-[10px] uppercase text-perps-muted-50 bg-gray-100/10 rounded px-2">
            Closed
          </span>
        ) : null}
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const LEADER_COLUMN: ColumnDef<PerpsVault, unknown> = {
  id: 'leader',
  header: 'Leader',
  accessorFn: (row) => row.summary.leader,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const leader = props.row.original.summary.leader
    const address = useAccount('evm')
    return (
      <div className={classNames('font-medium flex items-center gap-1')}>
        {address?.toLowerCase() === leader.toLowerCase()
          ? 'You'
          : truncateString(leader, 10, 'middle')}
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
export const APR_COLUMN: ColumnDef<PerpsVault, unknown> = {
  id: 'apr',
  header: 'APR',
  accessorFn: (row) => row.apr,
  sortingFn: (rowA, rowB) => {
    const aprA = rowA.original.apr
    const aprB = rowB.original.apr
    if (aprA === undefined) return 1
    if (aprB === undefined) return -1
    return aprA - aprB
  },
  cell: (props) => {
    const apr = props.row.original.apr
    return (
      <div
        className={classNames(
          'font-medium flex items-center gap-1',
          getTextColorClass(apr),
        )}
      >
        {formatPercent(apr)}
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const TVL_COLUMN: ColumnDef<PerpsVault, unknown> = {
  id: 'tvl',
  header: 'TVL',
  accessorFn: (row) => Number(row.summary.tvl),
  sortingFn: (rowA, rowB) => {
    const tvlA = Number(rowA.original.summary.tvl)
    const tvlB = Number(rowB.original.summary.tvl)
    if (tvlA === undefined) return 1
    if (tvlB === undefined) return -1
    return tvlA - tvlB
  },
  cell: (props) => {
    const tvl = Number(props.row.original.summary.tvl)
    return (
      <div className={classNames('font-medium flex items-center gap-1')}>
        {currencyFormatter.format(tvl)}
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const DEPOSIT_COLUMN: ColumnDef<PerpsVault, unknown> = {
  id: 'deposit',
  header: 'Your Deposit',
  accessorFn: (row) => Number(row.depositAmount),
  sortingFn: (rowA, rowB) => {
    const depositA = Number(rowA.original.depositAmount)
    const depositB = Number(rowB.original.depositAmount)
    if (depositA === undefined) return 1
    if (depositB === undefined) return -1
    return depositA - depositB
  },
  cell: (props) => {
    const deposit = Number(props.row.original.depositAmount)
    return (
      <div className={classNames('font-medium flex items-center gap-1')}>
        {currencyFormatter.format(deposit)}
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const AGE_COLUMN: ColumnDef<PerpsVault, unknown> = {
  id: 'age',
  header: 'Age (days)',
  accessorFn: (row) => Number(row.summary.createTimeMillis),
  sortingFn: (rowA, rowB) => {
    const ageA = Number(rowA.original.summary.createTimeMillis)
    const ageB = Number(rowB.original.summary.createTimeMillis)
    if (ageA === undefined) return 1
    if (ageB === undefined) return -1
    return ageB - ageA
  },
  cell: (props) => {
    const age = Number(props.row.original.summary.createTimeMillis)
    const timeInDays = Math.floor((Date.now() - age) / (1000 * 60 * 60 * 24))
    return (
      <div className={classNames('font-medium flex items-center gap-1')}>
        {timeInDays}
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const SNAPSHOT_COLUMN: ColumnDef<PerpsVault, unknown> = {
  id: 'snapshot',
  header: 'Snapshot',
  cell: (props) => {
    return (
      <div>
        <SparklineCell row={props.row} />
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

const width = 75
const height = 10

const SparklineCell = (props: { row: { original: PerpsVault } }) => {
  const {
    state: { pnlTimeframe },
  } = useUserVaultsState()

  const pnls = props.row.original.pnls
  const key = TIMEFRAME_TO_PNL_KEY[pnlTimeframe]

  const pnlForTimeframe = pnls
    .find(([timeframe]) => timeframe === key)?.[1]
    ?.map(Number) ?? [0, 0]

  const { points, isPositive } = useMemo(() => {
    const min = Math.min(...pnlForTimeframe)
    const max = Math.max(...pnlForTimeframe)
    const range = max - min || 1

    const isPositive =
      pnlForTimeframe[pnlForTimeframe.length - 1] >= pnlForTimeframe[0]

    const points = pnlForTimeframe
      .map((value, i) => {
        const x = (i / (pnlForTimeframe.length - 1)) * width

        const y = height - ((value - min) / range) * height

        return `${x},${y}`
      })
      .join(' ')

    return { points, isPositive }
  }, [pnlForTimeframe])

  return (
    <svg width={width} height={height} className="overflow-visible">
      <motion.polyline
        key={pnlTimeframe}
        fill="none"
        points={points}
        className={isPositive ? 'stroke-perps-green' : 'stroke-perps-red'}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
      />
    </svg>
  )
}
