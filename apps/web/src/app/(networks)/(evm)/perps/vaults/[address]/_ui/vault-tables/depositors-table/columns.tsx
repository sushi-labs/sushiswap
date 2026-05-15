import { classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { currencyFormatter } from 'src/lib/perps'
import type { DepositorType } from 'src/lib/perps/info/use-vault-details'
import { useAccount } from 'src/lib/wallet'
import { truncateString } from 'sushi'
import { columnBodyMeta } from '~evm/perps/_ui/trade-tables/_common'

export const DEPOSITOR_COLUMN: ColumnDef<DepositorType, unknown> = {
  id: 'depositor',
  header: 'Depositor',
  accessorFn: (row) => row.user,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const depositor = props.row.original.user
    const address = useAccount('evm')
    return (
      <div className={classNames('font-medium flex items-center gap-1')}>
        {depositor !== 'Leader'
          ? address?.toLowerCase() === depositor.toLowerCase()
            ? 'You'
            : truncateString(depositor, 10, 'middle')
          : depositor}
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const VAULT_AMOUNT_COLUMN: ColumnDef<DepositorType, unknown> = {
  id: 'vaultAmount',
  header: 'Vault Amount',
  accessorFn: (row) => Number(row.vaultEquity),
  sortingFn: (rowA, rowB) => {
    const a = Number(rowA.original.vaultEquity)
    const b = Number(rowB.original.vaultEquity)
    if (a > b) return 1
    if (a < b) return -1
    return 0
  },
  cell: (props) => {
    const amount = Number(props.row.original.vaultEquity)
    return (
      <div className={classNames('font-medium flex items-center gap-1')}>
        {currencyFormatter.format(amount)}
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const UNREALIZED_PNL_COLUMN: ColumnDef<DepositorType, unknown> = {
  id: 'unrealizedPnl',
  header: 'Unrealized PnL',
  accessorFn: (row) => Number(row.pnl),
  sortingFn: (rowA, rowB) => {
    const a = Number(rowA.original.pnl)
    const b = Number(rowB.original.pnl)
    if (a > b) return 1
    if (a < b) return -1
    return 0
  },
  cell: (props) => {
    const amount = Number(props.row.original.pnl)
    return (
      <div className={classNames('font-medium flex items-center gap-1')}>
        {currencyFormatter.format(amount)}
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const ALL_TIME_PNL_COLUMN: ColumnDef<DepositorType, unknown> = {
  id: 'allTimePnl',
  header: 'All-time PnL',
  accessorFn: (row) => Number(row.allTimePnl),
  sortingFn: (rowA, rowB) => {
    const a = Number(rowA.original.allTimePnl)
    const b = Number(rowB.original.allTimePnl)
    if (a > b) return 1
    if (a < b) return -1
    return 0
  },
  cell: (props) => {
    const amount = Number(props.row.original.allTimePnl)
    return (
      <div className={classNames('font-medium flex items-center gap-1')}>
        {currencyFormatter.format(amount)}
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const DAYS_FOLLOWING_COLUMN: ColumnDef<DepositorType, unknown> = {
  id: 'daysFollowing',
  header: 'Days Following',
  accessorFn: (row) => row.daysFollowing,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const amount = Number(props.row.original.daysFollowing)
    return (
      <div className={classNames('font-medium flex items-center gap-1')}>
        {amount}
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
