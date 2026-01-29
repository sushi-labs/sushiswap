import { classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import type { FundingHistoryItemType } from 'src/lib/perps/use-funding-history'
import {
  getTextColorClass,
  getTextColorClassForHover,
} from 'src/lib/perps/utils'
import { useAssetState } from '../../asset-state-provider'
import { columnBodyMeta } from '../column-meta'

export const TIME_COLUMN: ColumnDef<FundingHistoryItemType, unknown> = {
  id: 'timestamp',
  header: 'Time',
  accessorFn: (row) => row.timestamp,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.timestamp - rowB.timestamp,
  cell: (props) => {
    const timestamp = props.row.original.timestamp

    return (
      <span className="font-medium whitespace-nowrap">
        {format(timestamp, 'M/d/yyyy - HH:mm:ss')}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const COIN_COLUMN: ColumnDef<FundingHistoryItemType, unknown> = {
  id: 'coin',
  header: 'Coin',
  accessorFn: (row) => row.coin,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const {
      mutate: { setActiveAsset },
    } = useAssetState()
    const coin = props.row.original.coin
    const side = props.row.original.side

    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          setActiveAsset(coin)
        }}
        type="button"
        className={classNames(
          'font-bold whitespace-nowrap transition-colors',
          getTextColorClassForHover(side === 'short' ? -1 : 1),
        )}
      >
        {coin}
      </button>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const SIZE_COLUMN: ColumnDef<FundingHistoryItemType, unknown> = {
  id: 'size',
  header: 'Size',
  accessorFn: (row) => row.size,
  sortingFn: ({ original: rowA }, { original: rowB }) => rowA.size - rowB.size,
  cell: (props) => {
    const coin = props.row.original.coin
    const size = props.row.original.size
    return (
      <span className="font-medium whitespace-nowrap">
        {size} {coin}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const SIDE_COLUMN: ColumnDef<FundingHistoryItemType, unknown> = {
  id: 'side',
  header: 'Position Side',
  accessorFn: (row) => row.side,
  sortingFn: ({ original: rowA }, { original: rowB }) => {
    const sideA = rowA.side === 'short' ? -1 : 1
    const sideB = rowB.side === 'short' ? -1 : 1
    return sideA - sideB
  },
  cell: (props) => {
    const side = props.row.original.side

    return (
      <span
        className={classNames(
          'font-medium whitespace-nowrap capitalize',
          getTextColorClass(side === 'short' ? -1 : 1),
        )}
      >
        {side}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const PAYMENT_COLUMN: ColumnDef<FundingHistoryItemType, unknown> = {
  id: 'payment',
  header: 'Payment',
  accessorFn: (row) => row.payment,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.payment) - Number.parseFloat(rowB.payment),
  cell: (props) => {
    const payment = Number.parseFloat(props.row.original.payment)

    return (
      <span
        className={classNames(
          'font-medium whitespace-nowrap capitalize',
          getTextColorClass(payment),
        )}
      >
        {payment.toFixed(4)} USDC
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
export const RATE_COLUMN: ColumnDef<FundingHistoryItemType, unknown> = {
  id: 'rate',
  header: 'Rate',
  accessorFn: (row) => row.rate,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.rate) - Number.parseFloat(rowB.rate),
  cell: (props) => {
    const rate = Number.parseFloat(props.row.original.rate)

    return (
      <span className={classNames('font-medium whitespace-nowrap capitalize')}>
        {(rate * 100).toFixed(4)}%
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
