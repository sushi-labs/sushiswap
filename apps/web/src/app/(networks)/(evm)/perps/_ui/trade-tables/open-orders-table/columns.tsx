import {
  Card,
  Chip,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  classNames,
} from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useMemo } from 'react'
import { useCancelOpenOrders } from 'src/lib/perps/exchange/use-cancel-open-orders'
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
import { TableButton } from '../../_common/table-button'
import { useAssetState } from '../../trade-widget/asset-state-provider'
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
    const direction = useMemo(() => {
      if (reduceOnly) {
        return side === 'A' ? 'Close Long' : 'Close Short'
      }
      return side === 'A' ? 'Short' : 'Long'
    }, [side, reduceOnly])

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

    return (
      <span className="font-medium whitespace-nowrap">
        {size === '0.0' ? '-' : numberFormatter.format(Number.parseFloat(size))}
      </span>
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
        {isMarketPrice ? 'Market' : `${enUSFormatNumber.format(value)} USDC`}
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
    const isMarketPrice = props.row.original.orderType.includes('Market')

    return (
      <span className="font-medium whitespace-nowrap">
        {isMarketPrice
          ? 'Market'
          : numberFormatter.format(Number.parseFloat(price))}
      </span>
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
    const isPositionTpsl = Boolean(props.row.original.children?.length)
    const ogOrder = props.row.original
    const tpSlChildren = [
      ogOrder,
      ...(props.row.original.children as UserOpenOrdersItemType[]),
    ]

    if (!isPositionTpsl) {
      return <span className="font-medium whitespace-nowrap">-</span>
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <TableButton>View</TableButton>
        </DialogTrigger>
        <DialogContent className="!max-w-3xl">
          <DialogHeader className="!text-left">
            <DialogTitle>Take Profit/Stop Loss</DialogTitle>
            <DialogDescription>
              View the take profit and stop loss orders associated with this
              open order.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[75vh] overflow-y-auto">
            {tpSlChildren?.map((tpSlOrder, idx) => {
              const isMarketPrice = tpSlOrder.orderType.includes('Market')
              const price = tpSlOrder.limitPx
              return (
                <div key={tpSlOrder.oid} className="text-sm">
                  <p className="text-muted-foreground text-center mb-2">
                    Order {idx + 1}
                  </p>
                  <Card>
                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium">
                          {tpSlOrder.orderType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Side</span>
                        <span
                          className={classNames(
                            'font-medium',
                            getTextColorClass(tpSlOrder.side === 'A' ? -1 : 1),
                          )}
                        >
                          {tpSlOrder.side === 'A' ? 'Short' : 'Long'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-medium">
                          {numberFormatter.format(
                            Number.parseFloat(tpSlOrder.sz),
                          )}{' '}
                          {ogOrder?.assetSymbol}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trigger</span>
                        <span className="font-medium">
                          {tpSlOrder.triggerCondition}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium">
                          {isMarketPrice
                            ? 'Market'
                            : numberFormatter.format(Number.parseFloat(price))}
                        </span>
                      </div>
                    </div>
                  </Card>
                  {idx + 1 !== tpSlChildren.length ? (
                    <>
                      <div className="h-10 min-h-10 w-[1px] mt-2 mx-auto bg-muted-foreground" />
                      <p className="mt-2 text-muted-foreground text-center">
                        If Order {idx + 2} filled, cancel Order {idx + 3}
                      </p>
                    </>
                  ) : null}
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
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
