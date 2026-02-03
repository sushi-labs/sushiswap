import { PencilIcon } from '@heroicons/react-v1/outline'
import {
  Chip,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { UserPositionsItemType } from 'src/lib/perps/use-user-positions'
import {
  currencyFormatter,
  getSignForValue,
  getTextColorClass,
  getTextColorClassForHover,
  numberFormatter,
} from 'src/lib/perps/utils'
import { useAssetState } from '../../asset-state-provider'
import { CloseAllPositionsDialog } from '../../exchange/close-all-positions-dialog'
import { UpdateLeverageDialog } from '../../exchange/update-leverage-dialog'
import { columnBodyMeta } from '../column-meta'
import { useTradeTables } from '../trade-tables-provider'

export const COIN_COLUMN: ColumnDef<UserPositionsItemType, unknown> = {
  id: 'coin',
  header: 'Coin',
  accessorFn: (row) => row.assetSymbol,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const {
      mutate: { setActiveAsset },
    } = useAssetState()
    const coin = props.row.original.position.coin
    const perpsDex = props.row.original.perpsDex
    const symbol = props.row.original.assetSymbol
    const currentLeverage = props.row.original.position.leverage.value
    const isCross = props.row.original.position.leverage.type === 'cross'

    const side = props.row.original.side

    return (
      <div className="flex items-center gap-1">
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
            <Chip
              variant={side === 'A' ? 'red' : 'green'}
              className="!px-1 ml-1"
            >
              {perpsDex}
            </Chip>
          ) : null}
        </button>
        <UpdateLeverageDialog
          assetString={coin}
          currentLeverage={currentLeverage}
          isCross={isCross}
          trigger={
            <button
              type="button"
              className={classNames(
                'font-bold whitespace-nowrap transition-colors',
                getTextColorClass(side === 'A' ? -1 : 1),
              )}
            >
              {`${props.row.original.position.leverage.value}x`}
            </button>
          }
        />
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const SIZE_COLUMN: ColumnDef<UserPositionsItemType, unknown> = {
  id: 'size',
  header: 'Size',
  accessorFn: (row) => row.position.szi,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.position.szi) - Number.parseFloat(rowB.position.szi),
  cell: (props) => {
    const size = Number.parseFloat(props.row.original.position.szi) ?? 0
    const assetSymbol = props.row.original.assetSymbol

    return (
      <span
        className={classNames(
          'font-medium whitespace-nowrap',
          getTextColorClass(size),
        )}
      >
        {numberFormatter.format(Math.abs(size))} {assetSymbol}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const POSITION_VALUE_COLUMN: ColumnDef<UserPositionsItemType, unknown> =
  {
    id: 'psoValue',
    header: 'Position Value',
    accessorFn: (row) => row.position.positionValue,
    sortingFn: ({ original: rowA }, { original: rowB }) =>
      Number.parseFloat(rowA.position.positionValue) -
      Number.parseFloat(rowB.position.positionValue),
    cell: (props) => {
      const positionValue = props.row.original.position.positionValue
      return (
        <span className="font-medium whitespace-nowrap">
          {numberFormatter.format(Number.parseFloat(positionValue))} USDC
        </span>
      )
    },
    meta: {
      body: columnBodyMeta,
    },
  }

export const ENTRY_PRICE_COLUMN: ColumnDef<UserPositionsItemType, unknown> = {
  id: 'entryPrice',
  header: 'Entry Price',
  accessorFn: (row) => row.position.entryPx,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.position.entryPx) -
    Number.parseFloat(rowB.position.entryPx),
  cell: (props) => {
    const entryPrice = props.row.original.position.entryPx
    return (
      <span className="font-medium whitespace-nowrap">
        {numberFormatter.format(Number.parseFloat(entryPrice))}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const MARK_PRICE_COLUMN: ColumnDef<UserPositionsItemType, unknown> = {
  id: 'markPrice',
  header: 'Mark Price',
  accessorFn: (row) => row.markPrice,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.markPrice) - Number.parseFloat(rowB.markPrice),
  cell: (props) => {
    const markPrice = props.row.original.markPrice
    return (
      <span className="font-medium whitespace-nowrap">
        {numberFormatter.format(Number.parseFloat(markPrice))}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const PNL_COLUMN: ColumnDef<UserPositionsItemType, unknown> = {
  id: 'pnlRoePc',

  header: () => (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild tabIndex={0}>
        <div className={classNames('font-medium underline whitespace-nowrap')}>
          PNL / (ROE %)
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        forceMount
        side="top"
        className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
      >
        <p>
          Mark price is used to estimate unrealized PNL. Only trade prices are
          used for realized PNL.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
  accessorFn: (row) => row.position?.unrealizedPnl,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.position?.unrealizedPnl ?? '0') -
    Number.parseFloat(rowB.position?.unrealizedPnl ?? '0'),
  cell: (props) => {
    if (!props.row.original.position.unrealizedPnl) {
      return '-'
    }
    const pnl = Number.parseFloat(
      props.row.original.position.unrealizedPnl ?? '0',
    )
    const marginUsed = Number.parseFloat(props.row.original.position.marginUsed)
    const roePc = (pnl / marginUsed) * 100

    return (
      <span
        className={classNames(
          'font-medium whitespace-nowrap',
          getTextColorClass(pnl),
        )}
      >
        {getSignForValue(pnl)}
        {currencyFormatter.format(pnl)} / ({getSignForValue(roePc)}
        {roePc.toFixed(1)}%)
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const LIQUIDATION_PRICE_COLUMN: ColumnDef<
  UserPositionsItemType,
  unknown
> = {
  id: 'liquidationPrice',
  header: 'Liq. Price',
  accessorFn: (row) => row.position.liquidationPx,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.position.liquidationPx ?? '0') -
    Number.parseFloat(rowB.position.liquidationPx ?? '0'),
  cell: (props) => {
    const liquidationPrice = props.row.original.position.liquidationPx
    return (
      <span className="font-medium whitespace-nowrap">
        {numberFormatter.format(Number.parseFloat(liquidationPrice ?? '0'))}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
export const MARGIN_COLUMN: ColumnDef<UserPositionsItemType, unknown> = {
  id: 'margin',
  header: () => (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild tabIndex={0}>
        <div className={classNames('font-medium underline whitespace-nowrap')}>
          Margin
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        forceMount
        side="top"
        className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
      >
        <p>For isolated positions, margin includes unrealized pnl.</p>
      </HoverCardContent>
    </HoverCard>
  ),
  accessorFn: (row) => row.position.marginUsed,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.position.marginUsed ?? '0') -
    Number.parseFloat(rowB.position.marginUsed ?? '0'),
  cell: (props) => {
    const marginUsed = props.row.original.position.marginUsed
    const marginType = props.row.original.position.leverage.type
    return (
      <span className="font-medium whitespace-nowrap capitalize">
        {currencyFormatter.format(Number.parseFloat(marginUsed ?? '0'))} (
        {marginType})
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
export const FUNDING_COLUMN: ColumnDef<UserPositionsItemType, unknown> = {
  id: 'funding',
  header: () => (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild tabIndex={0}>
        <div className={classNames('font-medium underline whitespace-nowrap')}>
          Funding
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        forceMount
        side="top"
        className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
      >
        <p>
          Net funding payments since the position was opened. Hover for all-time
          and since changed.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
  accessorFn: (row) => row.position.cumFunding.sinceOpen,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.position.cumFunding.sinceOpen ?? '0') -
    Number.parseFloat(rowB.position.cumFunding.sinceOpen ?? '0'),
  cell: (props) => {
    const sinceOpen = Number.parseFloat(
      props.row.original.position.cumFunding.sinceOpen ?? '0',
    )
    const allTime = Number.parseFloat(
      props.row.original.position.cumFunding.allTime ?? '0',
    )
    const sinceChange = Number.parseFloat(
      props.row.original.position.cumFunding.sinceChange ?? '0',
    )

    return (
      <HoverCard openDelay={0}>
        <HoverCardTrigger asChild tabIndex={0}>
          <div
            className={classNames(
              'font-medium underline whitespace-nowrap',
              getTextColorClass(sinceOpen),
            )}
          >
            {getSignForValue(sinceOpen)}
            {currencyFormatter.format(sinceOpen)}
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          forceMount
          side="top"
          className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
        >
          <p>
            All Time: {getSignForValue(allTime)}
            {currencyFormatter.format(allTime)} Since Last Change:{' '}
            {getSignForValue(sinceChange)}
            {currencyFormatter.format(sinceChange)}
          </p>
        </HoverCardContent>
      </HoverCard>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const CLOSE_COLUMN: ColumnDef<UserPositionsItemType, unknown> = {
  id: 'Close',
  header: (props) => {
    const userPositions = props.table
      .getRowModel()
      .rows.map((row) => row.original)
    return <CloseAllPositionsDialog userPositions={userPositions} />
  },
  cell: (_props) => {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            alert('todo: close at limit position dialog')
          }}
          // disabled={isPending}
          type="button"
          className="font-medium text-blue hover:text-blue/80 disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          Limit
        </button>
        <button
          onClick={() => {
            alert('todo: close at market position dialog')
          }}
          // disabled={isPending}
          type="button"
          className="font-medium text-blue hover:text-blue/80 disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          Market
        </button>
        <button
          onClick={() => {
            alert('todo: close at market and open reverse dialog')
          }}
          // disabled={isPending}
          type="button"
          className="font-medium text-blue hover:text-blue/80 disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          Reverse
        </button>
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const TP_SL_COLUMN: ColumnDef<UserPositionsItemType, unknown> = {
  id: 'tpSl',
  header: 'TP/SL',
  cell: (_props) => {
    const {
      mutate: { setActiveTab },
    } = useTradeTables()
    return (
      <div className="flex items-center gap-4 whitespace-nowrap">
        <button
          onClick={() => {
            setActiveTab('open-orders')
          }}
          type="button"
          className="font-medium text-blue hover:text-blue/80 disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          View Orders
        </button>
        <button
          onClick={() => {
            alert('todo: edit tp/sl for position dialog')
          }}
          // disabled={isPending}
          type="button"
          className="font-medium text-blue hover:text-blue/80 disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
