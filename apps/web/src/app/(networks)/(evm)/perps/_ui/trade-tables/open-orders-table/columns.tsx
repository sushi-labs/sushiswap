import PencilIcon from '@heroicons/react/20/solid/PencilIcon'
import { useBreakpoint } from '@sushiswap/hooks'
import { Chip, classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { memo, useCallback, useMemo, useState } from 'react'
import {
  type UserOpenOrdersItemType,
  getTextColorClass,
  getTextColorClassForHover,
  perpsNumberFormatter,
} from 'src/lib/perps'
import { InlineEdit, TableButton } from '../../_common'
import { CancelAllOpenOrdersDialog } from '../../exchange'
import { useAssetState } from '../../trade-widget'
import { ViewTpSlDialog, columnBodyMeta } from '../_common'

export const TIME_COLUMN: ColumnDef<UserOpenOrdersItemType, unknown> = {
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

export const TYPE_COLUMN: ColumnDef<UserOpenOrdersItemType, unknown> = {
  id: 'type',
  header: 'Type',
  accessorFn: (row) => row.orderType,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const type = props.row.original.orderType

    return <span className="font-medium lg:whitespace-nowrap">{type}</span>
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
          'font-bold lg:whitespace-nowrap transition-colors',
          getTextColorClassForHover(side === 'A' ? -1 : 1),
        )}
      >
        {symbol}
        {perpsDex ? (
          <Chip
            variant={side === 'A' ? 'perps-red' : 'perps-green'}
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
          'font-medium lg:whitespace-nowrap',
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

export const SIZE_COLUMN = ({
  handleConfirmModify,
  isModifyPending,
}: {
  handleConfirmModify: (
    openOrder: UserOpenOrdersItemType,
    newValue: string,
    type: 'size' | 'price',
  ) => void
  isModifyPending: boolean
}): ColumnDef<UserOpenOrdersItemType, unknown> => ({
  id: 'size',
  header: 'Size',
  accessorFn: (row) => row.sz,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.sz) - Number.parseFloat(rowB.sz),
  cell: (props) => {
    const [isEditing, setIsEditing] = useState(false)
    const order = props.row.original
    const size = order.sz
    const isTrigger = order.isTrigger

    if (size === '0.0') {
      return (
        <span className="font-medium lg:whitespace-nowrap">
          {isTrigger ? 'Close Position' : '-'}
        </span>
      )
    }

    if (!isEditing) {
      return (
        <div className="flex  whitespace-nowrap items-center gap-1">
          <span className="font-medium">{size}</span>
          <TableButton onClick={() => setIsEditing(true)} type="button">
            <PencilIcon className="w-4 h-4" />
          </TableButton>
        </div>
      )
    }

    return (
      <InlineEdit
        value={perpsNumberFormatter({ value: size })}
        rawValue={size}
        onConfirm={(newValue) => {
          handleConfirmModify(order, newValue, 'size')
          setIsEditing(false)
        }}
        isPending={isModifyPending}
        isEditing={isEditing}
      />
    )
  },
  meta: {
    body: columnBodyMeta,
  },
})

export const OG_SIZE_COLUMN: ColumnDef<UserOpenOrdersItemType, unknown> = {
  id: 'ogSize',
  header: 'Original Size',
  accessorFn: (row) => row.origSz,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.origSz) - Number.parseFloat(rowB.origSz),
  cell: (props) => {
    const origSz = props.row.original.origSz
    return (
      <span className="font-medium lg:whitespace-nowrap">
        {origSz === '0.0' ? '-' : perpsNumberFormatter({ value: origSz })}
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
      <span className="font-medium lg:whitespace-nowrap">
        {Number(value) === 0
          ? '-'
          : isMarketPrice
            ? 'Market'
            : `${perpsNumberFormatter({ value, minFraxDigits: 2, maxFraxDigits: 2 })} USDC`}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const PRICE_COLUMN = ({
  handleConfirmModify,
  isModifyPending,
}: {
  handleConfirmModify: (
    openOrder: UserOpenOrdersItemType,
    newValue: string,
    type: 'size' | 'price',
  ) => void
  isModifyPending: boolean
}): ColumnDef<UserOpenOrdersItemType, unknown> => ({
  id: 'price',
  header: 'Price',
  accessorFn: (row) => row.limitPx,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.limitPx) - Number.parseFloat(rowB.limitPx),
  cell: (props) => {
    const [isEditing, setIsEditing] = useState(false)
    const order = props.row.original
    const price = order.limitPx

    const isMarketPrice = order.orderType.includes('Market')
    if (isMarketPrice) {
      return <span className="font-medium lg:whitespace-nowrap">Market</span>
    }

    if (!isEditing) {
      return (
        <div className="flex  whitespace-nowrap items-center gap-1">
          <span className="font-medium">{price}</span>
          <TableButton onClick={() => setIsEditing(true)} type="button">
            <PencilIcon className="w-4 h-4" />
          </TableButton>
        </div>
      )
    }

    return (
      <InlineEdit
        value={perpsNumberFormatter({ value: price })}
        rawValue={price}
        onConfirm={(newValue) => {
          handleConfirmModify(order, newValue, 'price')
          setIsEditing(false)
        }}
        isPending={isModifyPending}
        isEditing={isEditing}
      />
    )
  },
  meta: {
    body: columnBodyMeta,
  },
})

export const REDUCE_COLUMN: ColumnDef<UserOpenOrdersItemType, unknown> = {
  id: 'reduceOnly',
  header: 'Reduce Only',
  accessorFn: (row) => row.reduceOnly,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.reduceOnly) - Number(rowB.reduceOnly),
  cell: (props) => {
    const reduceOnly = props.row.original.reduceOnly ? 'Yes' : 'No'
    return (
      <span className="font-medium lg:whitespace-nowrap">{reduceOnly}</span>
    )
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
      <span className="font-medium lg:whitespace-nowrap">
        {triggerCondition}
      </span>
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

export const CANCEL_COLUMN = ({
  onCancelOrder,
  isCancelPending,
}: {
  onCancelOrder: (order: UserOpenOrdersItemType) => void
  isCancelPending: boolean
}): ColumnDef<UserOpenOrdersItemType, unknown> => ({
  id: 'cancel',
  header: () => <CancelColumnHeader />,
  cell: (props) => {
    return (
      <CancelOrderCell
        order={props.row.original}
        onCancelOrder={onCancelOrder}
        isCancelPending={isCancelPending}
      />
    )
    // return (
    //   <CancelOpenOrder
    //     orderId={props.row.original.oid}
    //     coin={props.row.original.coin}
    //   />
    // )
  },
  meta: {
    body: columnBodyMeta,
  },
})

const CancelColumnHeader = () => {
  const { isLg } = useBreakpoint('lg')

  return isLg ? <CancelAllOpenOrdersDialog /> : <div>Cancel Order</div>
}

const CancelOrderCell = memo(function CancelOrderCell({
  order,
  onCancelOrder,
  isCancelPending,
}: {
  order: UserOpenOrdersItemType
  onCancelOrder: (order: UserOpenOrdersItemType) => void
  isCancelPending: boolean
}) {
  const handleClick = useCallback(() => {
    onCancelOrder(order)
  }, [onCancelOrder, order])

  return (
    <TableButton onClick={handleClick} disabled={isCancelPending}>
      Cancel
    </TableButton>
  )
})
