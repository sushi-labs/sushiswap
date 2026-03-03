import { formatPrice, formatSize } from '@nktkas/hyperliquid/utils'
import { Chip, classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useMemo } from 'react'
import { useCancelOpenOrders } from 'src/lib/perps/exchange/use-cancel-open-orders'
import {
  useModifyOrder,
  usePrepModifyOrderData,
} from 'src/lib/perps/exchange/use-modify-order'
import {
  type UserOpenOrdersItemType,
  useUserOpenOrders,
} from 'src/lib/perps/use-user-open-orders'
import {
  enUSFormatNumber,
  getTextColorClass,
  getTextColorClassForHover,
  numberFormatter,
} from 'src/lib/perps/utils'
import { InlineEdit } from '../../_common/inline-edit'
import { TableButton } from '../../_common/table-button'
import { useAssetState } from '../../trade-widget/asset-state-provider'
import { ViewTpSlDialog } from '../_common/view-tpsl-dialog'
import { columnBodyMeta } from '../column-meta'

export const TIME_COLUMN: ColumnDef<UserOpenOrdersItemType, unknown> = {
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

export const TYPE_COLUMN: ColumnDef<UserOpenOrdersItemType, unknown> = {
  id: 'type',
  header: 'Type',
  accessorFn: (row) => row.orderType,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const type = props.row.original.orderType

    return <span className="font-medium whitespace-nowrap">{type}</span>
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const COIN_COLUMN: ColumnDef<UserOpenOrdersItemType, unknown> = {
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
    const symbol =
      props.row.original.assetSymbol?.split(':')?.[1] ||
      props.row.original.assetSymbol

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

export const DIRECTION_COLUMN: ColumnDef<UserOpenOrdersItemType, unknown> = {
  id: 'direction',
  header: 'Direction',
  accessorFn: (row) => row.side,
  sortingFn: ({ original: rowA }, { original: rowB }) => {
    const sideA = rowA.side === 'A' ? -1 : 1
    const sideB = rowB.side === 'A' ? -1 : 1
    return sideA - sideB
  },
  cell: (props) => {
    const side = props.row.original.side
    const reduceOnly = props.row.original.reduceOnly
    const coin = props.row.original.coin
    const direction = useMemo(() => {
      if (coin.startsWith('@')) {
        return side === 'A' ? 'Sell' : 'Buy'
      }
      if (reduceOnly) {
        return side === 'A' ? 'Close Long' : 'Close Short'
      }
      return side === 'A' ? 'Short' : 'Long'
    }, [side, reduceOnly, coin])

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

export const SIZE_COLUMN: ColumnDef<UserOpenOrdersItemType, unknown> = {
  id: 'size',
  header: 'Size',
  accessorFn: (row) => row.sz,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.sz) - Number.parseFloat(rowB.sz),
  cell: (props) => {
    const size = props.row.original.sz
    const decimals = props.row.original.szDecimals
    const isTrigger = props.row.original.isTrigger
    const currentOrderData = usePrepModifyOrderData({
      openOrder: props.row.original,
    })
    const { modifyOrder, isPending } = useModifyOrder()

    if (size === '0.0') {
      return (
        <span className="font-medium whitespace-nowrap">
          {isTrigger ? 'Close Position' : '-'}
        </span>
      )
    }

    return (
      <InlineEdit
        value={numberFormatter.format(Number.parseFloat(size))}
        rawValue={size}
        onConfirm={(newValue) => {
          if (!currentOrderData) return
          if (decimals === undefined) return
          try {
            const newSize = formatSize(newValue, decimals)
            modifyOrder({
              ...currentOrderData,
              size: newSize,
            })
          } catch (e) {
            console.error('Failed to modify order size', e)
          }
        }}
        isPending={isPending}
      />
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
export const OG_SIZE_COLUMN: ColumnDef<UserOpenOrdersItemType, unknown> = {
  id: 'ogSize',
  header: 'Original Size',
  accessorFn: (row) => row.origSz,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.origSz) - Number.parseFloat(rowB.origSz),
  cell: (props) => {
    const origSz = props.row.original.origSz
    return (
      <span className="font-medium whitespace-nowrap">
        {origSz === '0.0'
          ? '-'
          : numberFormatter.format(Number.parseFloat(origSz))}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const VALUE_COLUMN: ColumnDef<UserOpenOrdersItemType, unknown> = {
  id: 'value',
  header: 'Value',
  accessorFn: (row) => {
    const price = Number.parseFloat(row.limitPx)
    const size = Number.parseFloat(row.sz)
    return price * size
  },
  sortingFn: ({ original: rowA }, { original: rowB }) => {
    const valueA = Number.parseFloat(rowA.limitPx) * Number.parseFloat(rowA.sz)
    const valueB = Number.parseFloat(rowB.limitPx) * Number.parseFloat(rowB.sz)
    return valueA - valueB
  },
  cell: (props) => {
    const price = Number.parseFloat(props.row.original.limitPx)
    const size = Number.parseFloat(props.row.original.sz)
    const value = price * size
    const isMarketPrice = props.row.original.orderType.includes('Market')

    return (
      <span className="font-medium whitespace-nowrap">
        {Number(value) === 0
          ? '-'
          : isMarketPrice
            ? 'Market'
            : `${enUSFormatNumber.format(value)} USDC`}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const PRICE_COLUMN: ColumnDef<UserOpenOrdersItemType, unknown> = {
  id: 'price',
  header: 'Price',
  accessorFn: (row) => row.limitPx,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.limitPx) - Number.parseFloat(rowB.limitPx),
  cell: (props) => {
    const price = props.row.original.limitPx
    const decimals = props.row.original.szDecimals
    const marketType = props.row.original.marketType
    const currentOrderData = usePrepModifyOrderData({
      openOrder: props.row.original,
    })

    const { modifyOrder, isPending } = useModifyOrder()
    const isMarketPrice = props.row.original.orderType.includes('Market')
    if (isMarketPrice) {
      return <span className="font-medium whitespace-nowrap">Market</span>
    }

    return (
      <InlineEdit
        value={numberFormatter.format(Number.parseFloat(price))}
        rawValue={price}
        onConfirm={(newValue) => {
          if (!currentOrderData) return
          if (decimals === undefined) return
          try {
            const newPrice = formatPrice(newValue, decimals, marketType)
            modifyOrder({
              ...currentOrderData,
              price: newPrice,
            })
          } catch (e) {
            console.error('Failed to modify order price', e)
          }
        }}
        isPending={isPending}
      />
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const REDUCE_COLUMN: ColumnDef<UserOpenOrdersItemType, unknown> = {
  id: 'reduceOnly',
  header: 'Reduce Only',
  accessorFn: (row) => row.reduceOnly,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.reduceOnly) - Number(rowB.reduceOnly),
  cell: (props) => {
    const reduceOnly = props.row.original.reduceOnly ? 'Yes' : 'No'
    return <span className="font-medium whitespace-nowrap">{reduceOnly}</span>
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const TRIGGER_CONDITIONS_COLUMN: ColumnDef<
  UserOpenOrdersItemType,
  unknown
> = {
  id: 'triggerConditions',
  header: 'Trigger Conditions',
  accessorFn: (row) => row.triggerCondition,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const triggerCondition = props.row.original.triggerCondition
    return (
      <span className="font-medium whitespace-nowrap">{triggerCondition}</span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const TP_SL_COLUMN: ColumnDef<UserOpenOrdersItemType, unknown> = {
  id: 'tpSl',
  header: 'TP/SL',
  accessorFn: (row) => row.isPositionTpsl,
  sortingFn: 'basic',
  cell: (props) => {
    const hasTpSl = Boolean(props.row.original.children?.length)
    const ogOrder = props.row.original
    const tpSlChildren = [
      ogOrder,
      ...(props.row.original.children as UserOpenOrdersItemType[]),
    ]

    if (!hasTpSl) {
      return <span className="font-medium whitespace-nowrap">-</span>
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

export const CANCEL_COLUMN: ColumnDef<UserOpenOrdersItemType, unknown> = {
  id: 'cancel',
  header: () => {
    return <CancelAll />
  },
  cell: (props) => {
    const { cancelOrdersAsync, isPending } = useCancelOpenOrders()
    const cancelData = [
      {
        orderId: props.row.original.oid,
        asset: props.row.original.coin,
      },
    ]
    return (
      <TableButton
        onClick={async () => {
          await cancelOrdersAsync({ cancelData })
        }}
        disabled={isPending}
      >
        Cancel
      </TableButton>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
const CancelAll = () => {
  const { data: openOrders } = useUserOpenOrders({})
  const allCancelData = useMemo(
    () =>
      openOrders?.map((i) => ({
        orderId: i.oid,
        asset: i.coin,
      })),
    [openOrders],
  )
  const { cancelOrdersAsync, isPending } = useCancelOpenOrders()

  return (
    <TableButton
      onClick={async () => {
        await cancelOrdersAsync({ cancelData: allCancelData })
      }}
      disabled={isPending || !allCancelData?.length}
    >
      Cancel All
    </TableButton>
  )
}
