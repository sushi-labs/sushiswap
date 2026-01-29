import { Chip, SkeletonText, classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useMemo } from 'react'
import type { OrderHistoryItemType } from 'src/lib/perps/use-order-history'
import {
  enUSFormatNumber,
  getTextColorClass,
  getTextColorClassForHover,
  numberFormatter,
} from 'src/lib/perps/utils'
import { useAssetState } from '../../asset-state-provider'

export const TIME_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'timestamp',
  header: 'Time',
  accessorFn: (row) => row.order.timestamp,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.order.timestamp - rowB.order.timestamp,
  cell: (props) => {
    const timestamp = props.row.original.order.timestamp

    return (
      <span className="font-medium whitespace-nowrap">
        {format(timestamp, 'M/d/yyyy - HH:mm:ss')}
      </span>
    )
  },
  meta: {
    body: {
      className: '!p-2 !pl-4 !h-[40px] !max-h-[40px] !text-xs',
      skeleton: (
        <div className="w-[80px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}

export const TYPE_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'type',
  header: 'Type',
  cell: (props) => {
    const type = props.row.original.order.orderType

    return <span className="font-medium whitespace-nowrap">{type}</span>
  },
  meta: {
    body: {
      className: '!p-2 !pl-4 !h-[40px] !max-h-[40px] !text-xs',
      skeleton: (
        <div className="w-[80px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}

export const COIN_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'coin',
  header: 'Coin',
  cell: (props) => {
    const {
      mutate: { setActiveAsset },
    } = useAssetState()
    const coin = props.row.original.order.coin
    const symbol = props.row.original.order.assetSymbol
    const assetName = symbol?.includes(':') ? symbol?.split(':')?.[1] : symbol
    const perpsDex = symbol?.includes(':') ? symbol?.split(':')?.[0] : null
    const side = props.row.original.order.side

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
    body: {
      className: '!p-2 !pl-4 !h-[40px] !max-h-[40px] !text-xs',
      skeleton: (
        <div className="w-[80px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
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
          'font-medium whitespace-nowrap',
          getTextColorClass(side === 'A' ? -1 : 1),
        )}
      >
        {sideText}
      </span>
    )
  },
  meta: {
    body: {
      className: '!p-2 !pl-4 !h-[40px] !max-h-[40px] !text-xs',
      skeleton: (
        <div className="w-[80px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}

export const SIZE_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'size',
  header: 'Size',
  cell: (props) => {
    const status = props.row.original.status
    const size =
      status !== 'filled'
        ? Number.parseFloat(props.row.original.order.origSz)
        : 0

    return <span className="font-medium whitespace-nowrap">{size || '-'}</span>
  },
  meta: {
    body: {
      className: '!p-2 !pl-4 !h-[40px] !max-h-[40px] !text-xs',
      skeleton: (
        <div className="w-[80px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}

export const FILLED_SIZE_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'filledSize',
  header: 'Filled Size',
  cell: (props) => {
    const status = props.row.original.status
    const size =
      status === 'filled'
        ? Number.parseFloat(props.row.original.order.origSz)
        : 0
    return <span className="font-medium whitespace-nowrap">{size || '-'}</span>
  },
  meta: {
    body: {
      className: '!p-2 !pl-4 !h-[40px] !max-h-[40px] !text-xs',
      skeleton: (
        <div className="w-[80px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}

export const ORDER_VALUE_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'orderValue',
  header: 'Order Value',
  cell: (props) => {
    const status = props.row.original.status
    const type = props.row.original.order.orderType
    const limitPrice = props.row.original.order.limitPx
    const ogSz = props.row.original.order.origSz

    if (status !== 'filled') {
      return <span className="font-medium whitespace-nowrap">Market</span>
    }

    const value = useMemo(() => {
      if (status === 'filled' && type === 'Market') return 0
      return Number.parseFloat(ogSz) * Number.parseFloat(limitPrice)
    }, [status, type, limitPrice, ogSz])

    return (
      <span className="font-medium whitespace-nowrap">
        {value ? `${enUSFormatNumber.format(value)} USDC` : '-'}
      </span>
    )
  },
  meta: {
    body: {
      className: '!p-2 !pl-4 !h-[40px] !max-h-[40px] !text-xs',
      skeleton: (
        <div className="w-[80px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}

export const PRICE_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'price',
  header: 'Price',
  cell: (props) => {
    const type = props.row.original.order.orderType
    const value = useMemo(() => {
      if (type === 'Market') return 'Market'
      return numberFormatter.format(
        Number.parseFloat(props.row.original.order.limitPx),
      )
    }, [type, props.row.original.order.limitPx])

    return <span className="font-medium whitespace-nowrap">{value}</span>
  },
  meta: {
    body: {
      className: '!p-2 !pl-4 !h-[40px] !max-h-[40px] !text-xs',
      skeleton: (
        <div className="w-[80px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}

export const REDUCE_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'reduceOnly',
  header: 'Reduce Only',
  cell: (props) => {
    const assetType = props.row.original.order.marketType
    const value =
      assetType === 'perp'
        ? props.row.original.order.reduceOnly
          ? 'Yes'
          : 'No'
        : '-'

    return <span className="font-medium whitespace-nowrap">{value}</span>
  },
  meta: {
    body: {
      className: '!p-2 !pl-4 !h-[40px] !max-h-[40px] !text-xs',
      skeleton: (
        <div className="w-[80px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}

export const TRIGGER_CONDITIONS_COLUMN: ColumnDef<
  OrderHistoryItemType,
  unknown
> = {
  id: 'triggerConditions',
  header: 'Trigger Conditions',
  cell: (props) => {
    const triggerCondition = props.row.original.order.triggerCondition

    return (
      <span className="font-medium whitespace-nowrap">{triggerCondition}</span>
    )
  },
  meta: {
    body: {
      className: '!p-2 !pl-4 !h-[40px] !max-h-[40px] !text-xs',
      skeleton: (
        <div className="w-[80px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}

export const TP_SL_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'tpSl',
  header: 'TP/SL',
  cell: (props) => {
    const isPositionTpsl = props.row.original.order.isPositionTpsl

    return (
      <span className="font-medium whitespace-nowrap">
        {isPositionTpsl ? 'Yes' : '-'}
      </span>
    )
  },
  meta: {
    body: {
      className: '!p-2 !pl-4 !h-[40px] !max-h-[40px] !text-xs !max-w-[80px]',
      skeleton: (
        <div className="w-[80px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}
export const STATUS_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'status',
  header: 'Status',
  cell: (props) => {
    const status = props.row.original.status
    const cleanedStatus = useMemo(() => {
      if (status.toLowerCase().includes('rejected')) {
        return 'Rejected'
      }
      return status
    }, [status])

    return (
      <span className="font-medium whitespace-nowrap capitalize">
        {cleanedStatus}
      </span>
    )
  },
  meta: {
    body: {
      className: '!p-2 !pl-4 !h-[40px] !max-h-[40px] !text-xs !max-w-[80px]',
      skeleton: (
        <div className="w-[80px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}

export const ORDER_ID_COLUMN: ColumnDef<OrderHistoryItemType, unknown> = {
  id: 'oid',
  header: 'Order ID',
  cell: (props) => {
    const orderId = props.row.original.order.oid

    return <span className="font-medium whitespace-nowrap">{orderId}</span>
  },
  meta: {
    body: {
      className: '!p-2 !pl-4 !h-[40px] !max-h-[40px] !text-xs',
      skeleton: (
        <div className="w-[80px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}
