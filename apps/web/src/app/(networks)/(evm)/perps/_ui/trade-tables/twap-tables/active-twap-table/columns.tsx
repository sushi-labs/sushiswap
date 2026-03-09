import { Chip, classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useCallback } from 'react'
import {
  type ActiveTwapItemType,
  getTextColorClass,
  getTextColorClassForHover,
  perpsNumberFormatter,
  useCancelTwap,
} from 'src/lib/perps'
import { TableButton } from '~evm/perps/_ui/_common'
import { useAssetState } from '../../../trade-widget/asset-state-provider'
import { columnBodyMeta } from '../../_common'

export const COIN_COLUMN: ColumnDef<ActiveTwapItemType, unknown> = {
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
          'font-bold lg:whitespace-nowrap transition-colors',
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

export const SIZE_COLUMN: ColumnDef<ActiveTwapItemType, unknown> = {
  id: 'size',
  header: 'Size',
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
          'font-medium lg:whitespace-nowrap transition-colors',
          getTextColorClass(side === 'A' ? -1 : 1),
        )}
      >
        {perpsNumberFormatter({ value: size })} {symbol}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const EXECUTED_SIZE_COLUMN: ColumnDef<ActiveTwapItemType, unknown> = {
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
          'font-medium lg:whitespace-nowrap transition-colors',
          size > 0 ? getTextColorClass(side === 'A' ? -1 : 1) : '',
        )}
      >
        {size > 0 ? `${perpsNumberFormatter({ value: size })} ${symbol}` : '--'}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const AVG_PRICE_COLUMN: ColumnDef<ActiveTwapItemType, unknown> = {
  id: 'avgPrice',
  header: 'Average Price',
  accessorFn: (row) => row.averagePrice,
  sortingFn: ({ original: rowA }, { original: rowB }) => {
    const priceA = rowA.averagePrice
    const priceB = rowB.averagePrice

    return priceA - priceB
  },
  cell: (props) => {
    const averagePrice = props.row.original.averagePrice

    return (
      <span className="font-medium lg:whitespace-nowrap">
        {averagePrice > 0
          ? perpsNumberFormatter({ value: averagePrice })
          : '--'}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const RUNTIME_COLUMN: ColumnDef<ActiveTwapItemType, unknown> = {
  id: 'runtime',
  header: 'Running Time / Total',
  accessorFn: (row) => row.runningTimeInMs,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.runningTimeInMs - rowB.runningTimeInMs,
  cell: (props) => {
    const minutes = props.row.original.minutes
    const hours = Math.floor(minutes / 60)
    const formattedRunningTime = props.row.original.formattedRunningTime

    return (
      <span className="font-medium lg:whitespace-nowrap">
        {formattedRunningTime} / {hours > 0 ? `${hours} hours ` : ''}
        {minutes % 60 > 0 ? `${minutes % 60} minutes` : ''}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const REDUCE_ONLY_COLUMN: ColumnDef<ActiveTwapItemType, unknown> = {
  id: 'reduceOnly',
  header: 'Reduce Only',
  accessorFn: (row) => row.reduceOnly,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.reduceOnly) - Number(rowB.reduceOnly),
  cell: (props) => {
    const reduceOnly = props.row.original.reduceOnly

    return (
      <span className="font-medium lg:whitespace-nowrap">
        {reduceOnly ? 'Yes' : 'No'}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const CREATION_TIME_COLUMN: ColumnDef<ActiveTwapItemType, unknown> = {
  id: 'timestamp',
  header: 'Creation Time',
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

export const TERMINATE_COLUMN: ColumnDef<ActiveTwapItemType, unknown> = {
  id: 'terminate',
  header: 'Terminate',
  cell: (props) => {
    const { cancelTwapOrderAsync, isPending } = useCancelTwap()
    const twapId = props.row.original.twapId
    const asset = props.row.original.coin

    const handleCancelTwap = useCallback(async () => {
      if (twapId === undefined) return
      await cancelTwapOrderAsync({ cancelData: { twapId, asset } })
    }, [cancelTwapOrderAsync, twapId, asset])

    return (
      <TableButton onClick={handleCancelTwap} disabled={isPending}>
        Terminate
      </TableButton>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
