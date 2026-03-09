import { Chip, classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useMemo } from 'react'
import {
  type OrderHistoryItemType,
  enUSFormatNumber,
  getPerpsDexAndCoin,
  getTextColorClass,
  getTextColorClassForHover,
  numberFormatter,
} from 'src/lib/perps'
import { useAssetState } from '../../trade-widget/asset-state-provider'
import { ViewTpSlDialog } from '../_common/view-tpsl-dialog'
import { columnBodyMeta } from '../column-meta'

export const TIME_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'timestamp',
  header: 'Time',
  accessorFn: (row) => row.order.timestamp,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.order.timestamp - rowB.order.timestamp,
  cell: (props) => {
    const timestamp = props.row.original.order.timestamp

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

export const TYPE_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'type',
  header: 'Type',
  accessorFn: (row) => row.order.orderType,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const type = props.row.original.order.orderType

    return <span className="font-medium lg:whitespace-nowrap">{type}</span>
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const COIN_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'coin',
  header: 'Coin',
  accessorFn: (row) => row.order.coin,
  sortingFn: ({ original: rowA }, { original: rowB }) => {
    const symbolA = rowA.order.assetSymbol
    const assetNameA = symbolA?.includes(':')
      ? symbolA?.split(':')?.[1]
      : symbolA
    const symbolB = rowB.order.assetSymbol
    const assetNameB = symbolB?.includes(':')
      ? symbolB?.split(':')?.[1]
      : symbolB

    return assetNameA!.localeCompare(assetNameB!)
  },
  cell: (props) => {
    const {
      mutate: { setActiveAsset },
    } = useAssetState()
    const coin = props.row.original.order.coin
    const { perpsDex } = getPerpsDexAndCoin(coin)
    const symbol = props.row.original.order.assetSymbol
    const assetName = symbol?.includes(':') ? symbol?.split(':')?.[1] : symbol

    const side = props.row.original.order.side

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
        {assetName}
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

const getSideValue = (side: 'A' | 'B') => (side === 'A' ? 1 : -1)

export const DIRECTION_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'direction',
  header: 'Direction',
  accessorFn: (row) => row.order.side,
  sortingFn: ({ original: rowA }, { original: rowB }) => {
    return getSideValue(rowA.order.side) - getSideValue(rowB.order.side)
  },
  cell: (props) => {
    const side = props.row.original.order.side
    const marketType = props.row.original.order.marketType

    const sideText = useMemo(() => {
      if (marketType === 'perp') {
        return side === 'A' ? 'Short' : 'Long'
      } else {
        return side === 'A' ? 'Sell' : 'Buy'
      }
    }, [marketType, side])

    return (
      <span
        className={classNames(
          'font-medium lg:whitespace-nowrap',
          getTextColorClass(side === 'A' ? -1 : 1),
        )}
      >
        {sideText}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const SIZE_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'size',
  header: 'Size',
  accessorFn: (row) => row.order.origSz,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.order.origSz) - Number.parseFloat(rowB.order.origSz),
  cell: (props) => {
    const status = props.row.original.status
    const size =
      status !== 'filled'
        ? Number.parseFloat(props.row.original.order.origSz)
        : 0

    return (
      <span className="font-medium lg:whitespace-nowrap">{size || '-'}</span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const FILLED_SIZE_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'filledSize',
  header: 'Filled Size',
  accessorFn: (row) => row.order.origSz,
  sortingFn: ({ original: rowA }, { original: rowB }) => {
    const sizeA =
      rowA.status === 'filled' ? Number.parseFloat(rowA.order.origSz) : 0
    const sizeB =
      rowB.status === 'filled' ? Number.parseFloat(rowB.order.origSz) : 0
    return sizeA - sizeB
  },
  cell: (props) => {
    const status = props.row.original.status
    const size =
      status === 'filled'
        ? Number.parseFloat(props.row.original.order.origSz)
        : 0
    return (
      <span className="font-medium lg:whitespace-nowrap">{size || '-'}</span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const ORDER_VALUE_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'orderValue',
  header: 'Order Value',
  accessorFn: (row) => {
    const type = row.order.orderType
    const limitPrice = row.order.limitPx
    const ogSz = row.order.origSz

    if (row.status !== 'filled' && type === 'Market') return 0
    return Number.parseFloat(ogSz) * Number.parseFloat(limitPrice)
  },
  sortingFn: ({ original: rowA }, { original: rowB }) => {
    const typeA = rowA.order.orderType
    const limitPriceA = rowA.order.limitPx
    const ogSzA = rowA.order.origSz

    const typeB = rowB.order.orderType
    const limitPriceB = rowB.order.limitPx
    const ogSzB = rowB.order.origSz

    const valueA =
      rowA.status !== 'filled' && typeA === 'Market'
        ? 0
        : Number.parseFloat(ogSzA) * Number.parseFloat(limitPriceA)
    const valueB =
      rowB.status !== 'filled' && typeB === 'Market'
        ? 0
        : Number.parseFloat(ogSzB) * Number.parseFloat(limitPriceB)

    return valueA - valueB
  },
  cell: (props) => {
    const status = props.row.original.status
    const type = props.row.original.order.orderType
    const limitPrice = props.row.original.order.limitPx
    const ogSz = props.row.original.order.origSz

    if (status !== 'filled') {
      return <span className="font-medium lg:whitespace-nowrap">Market</span>
    }

    const value = useMemo(() => {
      if (status === 'filled' && type === 'Market') return 0
      return Number.parseFloat(ogSz) * Number.parseFloat(limitPrice)
    }, [status, type, limitPrice, ogSz])

    return (
      <span className="font-medium lg:whitespace-nowrap">
        {value ? `${enUSFormatNumber.format(value)} USDC` : '-'}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const PRICE_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'price',
  header: 'Price',
  accessorFn: (row) => {
    row.order.limitPx
  },
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.order.limitPx) -
    Number.parseFloat(rowB.order.limitPx),
  cell: (props) => {
    const type = props.row.original.order.orderType
    const value = useMemo(() => {
      if (type === 'Market') return 'Market'
      return numberFormatter.format(
        Number.parseFloat(props.row.original.order.limitPx),
      )
    }, [type, props.row.original.order.limitPx])

    return <span className="font-medium lg:whitespace-nowrap">{value}</span>
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const REDUCE_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'reduceOnly',
  header: 'Reduce Only',
  accessorFn: (row) => row.order.reduceOnly,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.order.reduceOnly) - Number(rowB.order.reduceOnly),
  cell: (props) => {
    const assetType = props.row.original.order.marketType
    const value =
      assetType === 'perp'
        ? props.row.original.order.reduceOnly
          ? 'Yes'
          : 'No'
        : '-'

    return <span className="font-medium lg:whitespace-nowrap">{value}</span>
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const TRIGGER_CONDITIONS_COLUMN: ColumnDef<
  OrderHistoryItemType,
  unknown
> = {
  id: 'triggerConditions',
  header: 'Trigger Conditions',
  accessorFn: (row) => row.order.triggerCondition,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const triggerCondition = props.row.original.order.triggerCondition

    return (
      <span className="font-medium lg:whitespace-nowrap">
        {triggerCondition}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const TP_SL_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'tpSl',
  header: 'TP/SL',
  accessorFn: (row) => row.order.children.length > 0,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.order.children.length > 0) -
    Number(rowB.order.children.length > 0),
  cell: (props) => {
    const hasTpSl = props.row.original.order.children.length > 0
    const ogOrder = props.row.original.order
    const tpSlChildren = [
      ogOrder,
      ...(props.row.original.order.children as OrderHistoryItemType['order'][]),
    ]
    if (!hasTpSl) {
      return <span className="font-medium lg:whitespace-nowrap">-</span>
    }

    return (
      <ViewTpSlDialog
        tpSlChildren={tpSlChildren}
        assetSymbol={ogOrder.assetSymbol || ''}
      />
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
export const STATUS_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'status',
  header: 'Status',
  accessorFn: (row) => row.status,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const status = props.row.original.status
    const cleanedStatus = useMemo(() => {
      if (status.toLowerCase().includes('rejected')) {
        return 'Rejected'
      }
      return status
    }, [status])

    return (
      <span className="font-medium lg:whitespace-nowrap capitalize">
        {cleanedStatus}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const ORDER_ID_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'oid',
  header: 'Order ID',
  accessorFn: (row) => row.order.oid,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const orderId = props.row.original.order.oid

    return <span className="font-medium lg:whitespace-nowrap">{orderId}</span>
  },
  meta: {
    body: columnBodyMeta,
  },
}
