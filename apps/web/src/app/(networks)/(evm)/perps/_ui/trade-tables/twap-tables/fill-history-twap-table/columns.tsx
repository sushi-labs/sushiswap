import {
  Chip,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import type { TwapFillHistoryItemType } from 'src/lib/perps/use-twap-fill-history'
import {
  enUSFormatNumber,
  getTextColorClass,
  getTextColorClassForHover,
  numberFormatter,
} from 'src/lib/perps/utils'
import { useAssetState } from '../../../trade-widget/asset-state-provider'
import { columnBodyMeta } from '../../column-meta'

export const TIME_COLUMN: ColumnDef<TwapFillHistoryItemType, unknown> = {
  id: 'timestamp',
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

export const COIN_COLUMN: ColumnDef<TwapFillHistoryItemType, unknown> = {
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

export const DIRECTION_COLUMN: ColumnDef<TwapFillHistoryItemType, unknown> = {
  id: 'direction',
  header: 'Direction',
  accessorFn: (row) => row.side,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    (rowA.side === 'A' ? -1 : 1) - (rowB.side === 'A' ? -1 : 1),
  cell: (props) => {
    const side = props.row.original.side
    const direction = props.row.original.dir
    return (
      <span
        className={classNames(
          'font-medium whitespace-nowrap transition-colors',
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

export const PRICE_COLUMN: ColumnDef<TwapFillHistoryItemType, unknown> = {
  id: 'price',
  header: 'Price',
  accessorFn: (row) => row.px,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.px) - Number.parseFloat(rowB.px),
  cell: (props) => {
    const price = Number.parseFloat(props.row.original.px)

    return (
      <span className="font-medium whitespace-nowrap">
        {numberFormatter.format(price)}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const SIZE_COLUMN: ColumnDef<TwapFillHistoryItemType, unknown> = {
  id: 'size',
  header: 'Size',
  accessorFn: (row) => row.sz,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.sz) - Number.parseFloat(rowB.sz),
  cell: (props) => {
    const size = Number.parseFloat(props.row.original.sz)
    const symbol = props.row.original.assetSymbol

    return (
      <span className="font-medium whitespace-nowrap">
        {numberFormatter.format(size)} {symbol}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const TRADE_VALUE_COLUMN: ColumnDef<TwapFillHistoryItemType, unknown> = {
  id: 'tradeValue',
  header: 'Trade Value',
  accessorFn: (row) => Number.parseFloat(row.sz) * Number.parseFloat(row.px),
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.sz) * Number.parseFloat(rowA.px) -
    Number.parseFloat(rowB.sz) * Number.parseFloat(rowB.px),
  cell: (props) => {
    const size = Number.parseFloat(props.row.original.sz)
    const price = Number.parseFloat(props.row.original.px)
    const value = size * price
    const feeToken = props.row.original.feeToken

    return (
      <span className="font-medium whitespace-nowrap">
        {enUSFormatNumber.format(value)} {feeToken}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
export const FEE_COLUMN: ColumnDef<TwapFillHistoryItemType, unknown> = {
  id: 'fee',
  header: 'Fee',
  accessorFn: (row) => Number.parseFloat(row.fee),
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.fee) - Number.parseFloat(rowB.fee),
  cell: (props) => {
    const fee = Number.parseFloat(props.row.original.fee)
    const feeToken = props.row.original.feeToken

    return (
      <span className="font-medium whitespace-nowrap">
        {enUSFormatNumber.format(fee)} {feeToken}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
export const CLOSED_PNL_COLUMN: ColumnDef<TwapFillHistoryItemType, unknown> = {
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
  accessorFn: (row) => {
    const closedPnl = Number.parseFloat(row.closedPnl)
    const fees = Number.parseFloat(row.fee)
    return closedPnl - fees
  },
  sortingFn: ({ original: rowA }, { original: rowB }) => {
    const totalPnlA =
      Number.parseFloat(rowA.closedPnl) - Number.parseFloat(rowA.fee)
    const totalPnlB =
      Number.parseFloat(rowB.closedPnl) - Number.parseFloat(rowB.fee)
    return totalPnlA - totalPnlB
  },
  cell: (props) => {
    const closedPnl = Number.parseFloat(props.row.original.closedPnl)
    const fees = Number.parseFloat(props.row.original.fee)
    const feeToken = props.row.original.feeToken
    const totalPnl = closedPnl - fees
    //todo: incorporate fee rebates into this calculation once we have that data available
    if (totalPnl === 0) {
      return '-'
    }
    return (
      <span className="font-medium whitespace-nowrap">
        {enUSFormatNumber.format(totalPnl)} {feeToken}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
