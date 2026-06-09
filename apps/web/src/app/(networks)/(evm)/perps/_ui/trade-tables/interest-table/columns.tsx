import { classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import {
  type UserBorrowLendInterestItemType,
  getTextColorClass,
} from 'src/lib/perps'
import { columnBodyMeta } from '../_common'

export const TIME_COLUMN: ColumnDef<UserBorrowLendInterestItemType, unknown> = {
  id: 'timestamp',
  header: 'Time',
  accessorFn: (row) => row.time,
  sortingFn: ({ original: rowA }, { original: rowB }) => rowA.time - rowB.time,
  cell: (props) => {
    const timestamp = props.row.original.time

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

export const TOKEN_COLUMN: ColumnDef<UserBorrowLendInterestItemType, unknown> =
  {
    id: 'token',
    header: 'Token',
    accessorFn: (row) => row.token,
    sortingFn: 'alphanumeric',
    cell: (props) => {
      const token = props.row.original.token

      return <span className="font-medium lg:whitespace-nowrap">{token}</span>
    },
    meta: {
      body: columnBodyMeta,
    },
  }

export const PAID_COLUMN: ColumnDef<UserBorrowLendInterestItemType, unknown> = {
  id: 'paid',
  header: 'Paid',
  accessorFn: (row) => row.borrow,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.borrow) - Number(rowB.borrow),

  cell: (props) => {
    const paid = Number.parseFloat(props.row.original.borrow)

    if (paid === 0) {
      return <span className="font-medium">--</span>
    }
    return (
      <span
        className={classNames(
          'font-medium lg:whitespace-nowrap',
          getTextColorClass(-1),
        )}
      >
        {paid}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const EARNED_COLUMN: ColumnDef<UserBorrowLendInterestItemType, unknown> =
  {
    id: 'earned',
    header: 'Earned',
    accessorFn: (row) => row.supply,
    sortingFn: ({ original: rowA }, { original: rowB }) =>
      Number(rowA.supply) - Number(rowB.supply),

    cell: (props) => {
      const earned = Number.parseFloat(props.row.original.supply)

      if (earned === 0) {
        return <span className="font-medium">--</span>
      }
      return (
        <span
          className={classNames(
            'font-medium lg:whitespace-nowrap',
            getTextColorClass(1),
          )}
        >
          {earned}
        </span>
      )
    },
    meta: {
      body: columnBodyMeta,
    },
  }
