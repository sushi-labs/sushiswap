import { Chip, classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import {
  type FundingHistoryItemType,
  getPerpsDexAndCoin,
  getTextColorClass,
  getTextColorClassForHover,
} from 'src/lib/perps'
import { useAssetState } from '../../trade-widget'
import { columnBodyMeta } from '../_common/column-meta'

export const TIME_COLUMN: ColumnDef<FundingHistoryItemType, unknown> = {
  id: 'timestamp',
  header: 'Time',
  accessorFn: (row) => row.timestamp,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.timestamp - rowB.timestamp,
  cell: (props) => {
    const timestamp = props.row.original.timestamp

    return (
      <span className="font-medium lg:lg:whitespace-nowrap">
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
    const { perpsDex } = getPerpsDexAndCoin(coin)
    const symbol = props.row.original.assetSymbol
    const side = props.row.original.side
    const assetName = symbol?.includes(':') ? symbol?.split(':')?.[1] : symbol

    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          setActiveAsset(coin)
        }}
        type="button"
        className={classNames(
          'font-bold lg:whitespace-nowrap transition-colors',
          getTextColorClassForHover(side === 'short' ? -1 : 1),
        )}
      >
        {assetName}
        {perpsDex ? (
          <Chip
            variant={side === 'short' ? 'red' : 'green'}
            className="!px-1 ml-1"
          >
            {perpsDex}
          </Chip>
        ) : null}
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
    const size = props.row.original.size
    const symbol = props.row.original.assetSymbol
    const assetName = symbol?.includes(':') ? symbol?.split(':')?.[1] : symbol
    return (
      <span className="font-medium lg:whitespace-nowrap">
        {size} {assetName}
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
          'font-medium lg:whitespace-nowrap capitalize',
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
          'font-medium lg:whitespace-nowrap capitalize',
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
      <span
        className={classNames('font-medium lg:whitespace-nowrap capitalize')}
      >
        {(rate * 100).toFixed(4)}%
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
