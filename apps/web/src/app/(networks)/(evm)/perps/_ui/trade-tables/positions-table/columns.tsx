import PencilIcon from '@heroicons/react/20/solid/PencilIcon'
import {
  Chip,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import {
  type UserPositionsItemType,
  currencyFormatter,
  getExistingPositionTpSlOrders,
  getSignForValue,
  getTextColorClass,
  getTextColorClassForHover,
  perpsNumberFormatter,
  useUserOpenOrders,
} from 'src/lib/perps'
import { TableButton } from '../../_common'
import { CloseAllPositionsDialog } from '../../exchange/close-all-positions-dialog'
import { EditTpSlPositionDialog } from '../../exchange/edit-tp-sl-position-dialog'
import { LimitCloseDialog } from '../../exchange/limit-close-dialog'
import { MarketCloseDialog } from '../../exchange/market-close-dialog'
import { ReversePositionDialog } from '../../exchange/reverse-position-dialog'
import { UpdateIsolatedMarginDialog } from '../../exchange/update-isloated-margin-dialog'
import { UpdateLeverageDialog } from '../../exchange/update-leverage-dialog'
import { useAssetState } from '../../trade-widget/asset-state-provider'
import { columnBodyMeta } from '../_common'
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
    const symbol =
      props.row.original.assetSymbol?.split(':')?.[1] ||
      props.row.original.assetSymbol
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
            'font-bold lg:whitespace-nowrap transition-colors',
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
                'font-bold lg:whitespace-nowrap transition-colors',
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
    const assetSymbol =
      props.row.original.assetSymbol?.split(':')?.[1] ??
      props.row.original.assetSymbol

    return (
      <span
        className={classNames(
          'font-medium lg:whitespace-nowrap',
          getTextColorClass(size),
        )}
      >
        {perpsNumberFormatter({ value: size })} {assetSymbol}
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
        <span className="font-medium lg:whitespace-nowrap">
          {perpsNumberFormatter({ value: positionValue })} USDC
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
      <span className="font-medium lg:whitespace-nowrap">
        {perpsNumberFormatter({ value: entryPrice })}
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
      <span className="font-medium lg:whitespace-nowrap">
        {perpsNumberFormatter({ value: markPrice })}
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
        <div
          className={classNames('font-medium underline lg:whitespace-nowrap')}
        >
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
          'font-medium lg:whitespace-nowrap',
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
    if (!liquidationPrice) {
      return <span className="font-medium lg:whitespace-nowrap">N/A</span>
    }
    return (
      <span className="font-medium lg:whitespace-nowrap">
        {perpsNumberFormatter({
          value: liquidationPrice,
        })}
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
        <div
          className={classNames('font-medium underline lg:whitespace-nowrap')}
        >
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
    if (marginType === 'cross') {
      return (
        <span className="font-medium lg:whitespace-nowrap capitalize">
          {currencyFormatter.format(Number.parseFloat(marginUsed ?? '0'))} (
          {marginType})
        </span>
      )
    }
    return (
      <UpdateIsolatedMarginDialog
        position={props.row.original}
        trigger={
          <button type="button" className="flex items-center gap-2">
            <span className="font-medium lg:whitespace-nowrap capitalize">
              {currencyFormatter.format(Number.parseFloat(marginUsed ?? '0'))} (
              {marginType})
            </span>
            <PencilIcon className="w-4 h-4 text-blue" />
          </button>
        }
      />
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
        <div
          className={classNames('font-medium underline lg:whitespace-nowrap')}
        >
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
              'font-medium underline lg:whitespace-nowrap',
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
  header: () => {
    return <CloseAllPositionsDialog />
  },
  cell: (props) => {
    const position = useMemo(() => props.row.original, [props.row.original])

    return (
      <div className="flex items-center gap-4">
        <LimitCloseDialog positionToClose={position} />
        <MarketCloseDialog positionToClose={position} />
        <ReversePositionDialog positionToClose={position} />
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
  cell: (props) => {
    const position = useMemo(() => props.row.original, [props.row.original])

    return (
      <div className="flex items-center gap-4 lg:whitespace-nowrap">
        <ViewOrders coin={position.position.coin} />
        <EditTpSlPositionDialog positionToClose={position} />
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

const ViewOrders = ({ coin }: { coin: string }) => {
  const {
    mutate: { setActiveTab },
  } = useTradeTables()
  const { data: openOrders } = useUserOpenOrders({ coin })

  const { existingTpOrder, existingSlOrder } = useMemo(() => {
    return getExistingPositionTpSlOrders(openOrders)
  }, [openOrders])

  if (
    Boolean(existingTpOrder?.triggerPx) ||
    Boolean(existingSlOrder?.triggerPx) ||
    !openOrders?.length
  ) {
    return (
      <div>
        {existingTpOrder
          ? perpsNumberFormatter({ value: existingTpOrder.triggerPx })
          : '--'}{' '}
        /{' '}
        {existingSlOrder
          ? perpsNumberFormatter({ value: existingSlOrder.triggerPx })
          : '--'}
      </div>
    )
  }

  return (
    <TableButton
      onClick={() => {
        setActiveTab('open-orders')
      }}
    >
      View Orders
    </TableButton>
  )
}
