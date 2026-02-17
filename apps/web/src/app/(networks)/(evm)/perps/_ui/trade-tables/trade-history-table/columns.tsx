import {
  Chip,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import type { TradeHistoryItemType } from 'src/lib/perps/use-trade-history'
import {
  enUSFormatNumber,
  getTextColorClass,
  getTextColorClassForHover,
  numberFormatter,
} from 'src/lib/perps/utils'
import { useAssetState } from '../../trade-widget/asset-state-provider'
import { columnBodyMeta } from '../column-meta'

export const TIME_COLUMN: ColumnDef<TradeHistoryItemType, unknown> = {
  id: 'time',
  header: 'Time',
  accessorFn: (row) => row.time,
  sortingFn: ({ original: rowA }, { original: rowB }) => rowA.time - rowB.time,
  cell: (props) => {
    const timestamp = props.row.original.time

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

export const COIN_COLUMN: ColumnDef<TradeHistoryItemType, unknown> = {
  id: 'coin',
  header: 'Coin',
  accessorFn: (row) => row.symbol,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const {
      mutate: { setActiveAsset },
    } = useAssetState()
    const coin = props.row.original.coin
    const perpsDex = props.row.original.perpsDex
    const symbol = props.row.original.symbol

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

export const DIRECTION_COLUMN: ColumnDef<TradeHistoryItemType, unknown> = {
  id: 'direction',
  header: 'Direction',
  accessorFn: (row) => row.dir,
  sortingFn: ({ original: rowA }, { original: rowB }) => {
    const sideA = rowA.side === 'A' ? -1 : 1
    const sideB = rowB.side === 'A' ? -1 : 1
    return sideA - sideB
  },
  cell: (props) => {
    const side = props.row.original.side
    const direction = props.row.original.dir

    return (
      <span
        className={classNames(
          'font-medium whitespace-nowrap',
          getTextColorClass(side === 'A' ? -1 : 1),
        )}
      >
        {direction}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const PRICE_COLUMN: ColumnDef<TradeHistoryItemType, unknown> = {
  id: 'price',
  header: 'Price',
  accessorFn: (row) => row.px,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.px) - Number.parseFloat(rowB.px),
  cell: (props) => {
    const price = props.row.original.px
    return (
      <span className="font-medium whitespace-nowrap">
        {numberFormatter.format(Number.parseFloat(price))}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
export const SIZE_COLUMN: ColumnDef<TradeHistoryItemType, unknown> = {
  id: 'size',
  header: 'Size',
  accessorFn: (row) => row.sz,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.sz) - Number.parseFloat(rowB.sz),
  cell: (props) => {
    const size = props.row.original.sz

    const token0Symbol = props.row.original.token0Symbol
    return (
      <span className="font-medium whitespace-nowrap">
        {numberFormatter.format(Number.parseFloat(size))} {token0Symbol}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
export const TRADE_VALUE_COLUMN: ColumnDef<TradeHistoryItemType, unknown> = {
  id: 'tradeValue',
  header: 'Trade Value',
  accessorFn: (row) => {
    const price = Number.parseFloat(row.px)
    const size = Number.parseFloat(row.sz)
    return price * size
  },
  sortingFn: ({ original: rowA }, { original: rowB }) => {
    const valueA = Number.parseFloat(rowA.px) * Number.parseFloat(rowA.sz)
    const valueB = Number.parseFloat(rowB.px) * Number.parseFloat(rowB.sz)
    return valueA - valueB
  },
  cell: (props) => {
    const price = Number.parseFloat(props.row.original.px)
    const size = Number.parseFloat(props.row.original.sz)
    const value = price * size

    return (
      <span className="font-medium whitespace-nowrap">
        {enUSFormatNumber.format(value)} USDC
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
export const FEE_COLUMN: ColumnDef<TradeHistoryItemType, unknown> = {
  id: 'fee',
  header: 'Fee',
  accessorFn: (row) => Number.parseFloat(row.fee),
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.fee) - Number.parseFloat(rowB.fee),
  cell: (props) => {
    const fee = Number.parseFloat(props.row.original.fee)
    const feeToken = props.row.original.feeToken

    if (fee === 0) {
      return '-'
    }
    return (
      <span className="font-medium whitespace-nowrap">
        {numberFormatter.format(fee)} {feeToken}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
export const CLOSED_PNL_COLUMN: ColumnDef<TradeHistoryItemType, unknown> = {
  id: 'closedPnl',
  header: () => {
    return (
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild tabIndex={0}>
          <span className="underline">Closed PnL</span>
        </HoverCardTrigger>
        <HoverCardContent
          forceMount
          side="top"
          className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
        >
          <p>Closed PnL includes fees and rebates</p>
        </HoverCardContent>
      </HoverCard>
    )
  },
  accessorFn: (row) => Number.parseFloat(row.closedPnl),
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.closedPnl) - Number.parseFloat(rowB.closedPnl),
  cell: (props) => {
    const closedPnl = Number.parseFloat(props.row.original.closedPnl)
    if (closedPnl === 0) {
      return '-'
    }
    return (
      <span className="font-medium whitespace-nowrap">
        {enUSFormatNumber.format(closedPnl)} USDC
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
