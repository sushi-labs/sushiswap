import { classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import {
  type UserNonFundingLedgerUpdatesItemType,
  getSignForValue,
  getTextColorClass,
  perpsNumberFormatter,
} from 'src/lib/perps'
import { columnBodyMeta } from '../_common'

export const TIME_COLUMN: ColumnDef<
  UserNonFundingLedgerUpdatesItemType,
  unknown
> = {
  id: 'timestamp',
  header: 'Time',
  accessorFn: (row) => row.timestamp,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.timestamp - rowB.timestamp,
  cell: (props) => {
    const timestamp = props.row.original.timestamp

    return (
      <span className="font-medium lg:whitespace-nowrap">
        {format(timestamp, 'M/d/yyyy - HH:mm:ss')}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const STATUS_COLUMN: ColumnDef<
  UserNonFundingLedgerUpdatesItemType,
  unknown
> = {
  id: 'status',
  header: 'Status',
  accessorFn: (row) => row.status,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const status = props.row.original.status

    return <span className="font-medium lg:whitespace-nowrap">{status}</span>
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const ACTION_COLUMN: ColumnDef<
  UserNonFundingLedgerUpdatesItemType,
  unknown
> = {
  id: 'action',
  header: 'Action',
  accessorFn: (row) => row.action,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const action = props.row.original.action

    return (
      <span className="font-medium lg:whitespace-nowrap capitalize">
        {action}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const SOURCE_COLUMN: ColumnDef<
  UserNonFundingLedgerUpdatesItemType,
  unknown
> = {
  id: 'source',
  header: 'Source',
  accessorFn: (row) => row.source,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const source = props.row.original.source

    return <span className="font-medium lg:whitespace-nowrap">{source}</span>
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const DESTINATION_COLUMN: ColumnDef<
  UserNonFundingLedgerUpdatesItemType,
  unknown
> = {
  id: 'destination',
  header: 'Destination',
  accessorFn: (row) => row.destination,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const destination = props.row.original.destination

    return (
      <span className="font-medium lg:whitespace-nowrap">{destination}</span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const ACC_VAL_CHANGE_COLUMN: ColumnDef<
  UserNonFundingLedgerUpdatesItemType,
  unknown
> = {
  id: 'accountValChange',
  header: 'Account Value Change',
  accessorFn: (row) => row.accountValChange.amount,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.accountValChange.amount) - Number(rowB.accountValChange.amount),
  cell: (props) => {
    const accountValChange = props.row.original.accountValChange
    const changeType = props.row.original.changeType

    return (
      <span
        className={classNames(
          'font-medium lg:whitespace-nowrap',
          getTextColorClass(changeType === 'negative' ? -1 : 1),
        )}
      >
        {changeType === 'negative' ? '-' : ''}
        {perpsNumberFormatter({ value: accountValChange.amount })}{' '}
        {accountValChange.token}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const FEE_COLUMN: ColumnDef<
  UserNonFundingLedgerUpdatesItemType,
  unknown
> = {
  id: 'fee',
  header: 'Fee',
  accessorFn: (row) => row.fee,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const fee = props.row.original.fee
    if (fee === 0) {
      return <span className="font-medium lg:whitespace-nowrap">--</span>
    }

    return (
      <span
        className={classNames(
          'font-medium lg:whitespace-nowrap',
          getTextColorClass(-1),
        )}
      >
        {perpsNumberFormatter({ value: fee })} USDC
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
