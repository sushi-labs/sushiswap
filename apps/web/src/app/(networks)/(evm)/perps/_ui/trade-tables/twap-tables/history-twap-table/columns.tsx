import { Chip, classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import type { TwapHistoryItemType } from 'src/lib/perps/use-twap-history'
import {
  getTextColorClass,
  getTextColorClassForHover,
  numberFormatter,
} from 'src/lib/perps/utils'
import { useAssetState } from '../../../trade-widget/asset-state-provider'
import { columnBodyMeta } from '../../column-meta'

export const TIME_COLUMN: ColumnDef<TwapHistoryItemType, unknown> = {
  id: 'timestamp',
  header: 'Time',
  accessorFn: (row) => row.timestamp,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.timestamp - rowB.timestamp,
  cell: (props) => {
    const timestamp = props.row.original.timestamp

    return (
      <span className="font-medium whitespace-nowrap">
        {format(timestamp * 1000, 'M/d/yyyy - HH:mm:ss')}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const COIN_COLUMN: ColumnDef<TwapHistoryItemType, unknown> = {
  id: 'coin',
  header: 'Coin',
  accessorFn: (row) => row.assetSymbol,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const {
      mutate: { setActiveAsset },
    } = useAssetState()
    const coin = props.row.original.coin
    const perpsDex = props.row.original.perpsDex
    const symbol = props.row.original.assetSymbol

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
          getTextColorClassForHover(side === 'A' ? -1 : 1),
        )}
      >
        {symbol}
        {perpsDex ? (
          <Chip variant={side === 'A' ? 'red' : 'green'} className="!px-1 ml-1">
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

export const TOTAL_SIZE_COLUMN: ColumnDef<TwapHistoryItemType, unknown> = {
  id: 'totalSize',
  header: 'Total Size',
  accessorFn: (row) => row.sz,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.sz) - Number.parseFloat(rowB.sz),
  cell: (props) => {
    const size = props.row.original.sz
    const side = props.row.original.side
    const symbol = props.row.original.assetSymbol
    return (
      <span
        className={classNames(
          'font-medium whitespace-nowrap transition-colors',
          getTextColorClass(side === 'A' ? -1 : 1),
        )}
      >
        {numberFormatter.format(Number.parseFloat(size))} {symbol}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const EXECUTED_SIZE_COLUMN: ColumnDef<TwapHistoryItemType, unknown> = {
  id: 'executedSize',
  header: 'Executed Size',
  accessorFn: (row) => row.executedSz,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.executedSz) - Number.parseFloat(rowB.executedSz),
  cell: (props) => {
    const size = Number.parseFloat(props.row.original.executedSz)
    const side = props.row.original.side
    const symbol = props.row.original.assetSymbol
    return (
      <span
        className={classNames(
          'font-medium whitespace-nowrap transition-colors',
          size > 0 ? getTextColorClass(side === 'A' ? -1 : 1) : '',
        )}
      >
        {size > 0 ? `${numberFormatter.format(size)} ${symbol}` : '--'}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const AVG_PRICE_COLUMN: ColumnDef<TwapHistoryItemType, unknown> = {
  id: 'avgPrice',
  header: 'Average Price',
  accessorFn: (row) => row.executedNtl,
  sortingFn: ({ original: rowA }, { original: rowB }) => {
    const priceA =
      Number.parseFloat(rowA.executedSz) > 0
        ? Number.parseFloat(rowA.executedNtl) /
          Number.parseFloat(rowA.executedSz)
        : 0
    const priceB =
      Number.parseFloat(rowB.executedSz) > 0
        ? Number.parseFloat(rowB.executedNtl) /
          Number.parseFloat(rowB.executedSz)
        : 0
    return priceA - priceB
  },
  cell: (props) => {
    const executedNtl = Number.parseFloat(props.row.original.executedNtl)
    const executedSize = Number.parseFloat(props.row.original.executedSz)
    const price = executedSize > 0 ? executedNtl / executedSize : 0
    return (
      <span className="font-medium whitespace-nowrap">
        {price > 0 ? numberFormatter.format(price) : '--'}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const TOTAL_RUNTIME_COLUMN: ColumnDef<TwapHistoryItemType, unknown> = {
  id: 'totalRuntime',
  header: 'Total Runtime',
  accessorFn: (row) => row.minutes,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.minutes - rowB.minutes,
  cell: (props) => {
    const minutes = props.row.original.minutes
    const hours = Math.floor(minutes / 60)

    return (
      <span className="font-medium whitespace-nowrap">
        {hours > 0 ? `${hours} hours ` : ''}
        {minutes > 0 ? `${minutes % 60} minutes` : ''}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const REDUCE_ONLY_COLUMN: ColumnDef<TwapHistoryItemType, unknown> = {
  id: 'reduceOnly',
  header: 'Reduce Only',
  accessorFn: (row) => row.reduceOnly,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.reduceOnly) - Number(rowB.reduceOnly),
  cell: (props) => {
    const reduceOnly = props.row.original.reduceOnly

    return (
      <span className="font-medium whitespace-nowrap">
        {reduceOnly ? 'Yes' : 'No'}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const RANDOMIZE_COLUMN: ColumnDef<TwapHistoryItemType, unknown> = {
  id: 'randomize',
  header: 'Randomize',
  accessorFn: (row) => row.randomize,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.randomize) - Number(rowB.randomize),
  cell: (props) => {
    const randomize = props.row.original.randomize

    return (
      <span className="font-medium whitespace-nowrap">
        {randomize ? 'Yes' : 'No'}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const STATUS_COLUMN: ColumnDef<TwapHistoryItemType, unknown> = {
  id: 'status',
  header: 'Status',
  accessorFn: (row) => row.status.status,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const status = props.row.original.status.status

    return (
      <span className="font-medium whitespace-nowrap capitalize">{status}</span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
