import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
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
  formatPrice,
  formatSize,
  getExistingPositionTpSlOrders,
  getSignForValue,
  getTextColorClass,
  getTextColorClassForHover,
  perpsNumberFormatter,
  useUserOpenOrders,
} from 'src/lib/perps'
import { AssetIcon, TableButton } from '../../_common'
import { useUserSettingsState } from '../../account-management'
import { CloseAllPositionsDialog } from '../../exchange'
import { MarketQuickClose } from '../../exchange/market-quick-close'
import { ReverseQuick } from '../../exchange/reverse-quick'
import { useAssetState } from '../../trade-widget'
import { columnBodyMeta } from '../_common'
import { useTradeTables } from '../trade-tables-provider'

export const COIN_COLUMN = (
  openModal: (
    action: 'update-leverage',
    position: UserPositionsItemType,
  ) => void,
): ColumnDef<UserPositionsItemType, unknown> => ({
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

    const side = props.row.original.side

    return (
      <div className="flex items-center gap-1 mr-4">
        <AssetIcon asset={props.row.original.fullAsset} size="sm" />
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
              className="!px-1 !py-0 rounded-md md:ml-1"
            >
              {perpsDex}
            </Chip>
          ) : null}
        </button>

        <button
          onClick={() => openModal('update-leverage', props.row.original)}
          type="button"
          className={classNames(
            'font-bold lg:whitespace-nowrap transition-colors',
            getTextColorClass(side === 'A' ? -1 : 1),
          )}
        >
          {`${props.row.original.position.leverage.value}x`}
        </button>
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
})
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
    const val = formatSize(size, props.row.original.decimals || 6)

    return (
      <span
        className={classNames(
          'font-medium lg:whitespace-nowrap',
          getTextColorClass(size),
        )}
      >
        {perpsNumberFormatter({ value: val })} {assetSymbol}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const POSITION_VALUE_COLUMN: ColumnDef<UserPositionsItemType, unknown> =
  {
    id: 'posValue',
    header: 'Position Value',
    accessorFn: (row) => row.position.positionValue,
    sortingFn: ({ original: rowA }, { original: rowB }) =>
      Number.parseFloat(rowA.position.positionValue) -
      Number.parseFloat(rowB.position.positionValue),
    cell: (props) => {
      const positionValue = props.row.original.position.positionValue
      return (
        <span className="font-medium lg:whitespace-nowrap">
          {perpsNumberFormatter({ value: positionValue, maxFraxDigits: 2 })}{' '}
          USDC
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
    const val = formatPrice(
      entryPrice,
      props.row.original.decimals || 6,
      'perp',
    )
    return (
      <span className="font-medium lg:whitespace-nowrap">
        {perpsNumberFormatter({ value: val })}
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
    const val = formatPrice(markPrice, props.row.original.decimals || 6, 'perp')
    return (
      <span className="font-medium lg:whitespace-nowrap">
        {perpsNumberFormatter({ value: val })}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const PNL_COLUMN = (
  openModal: (action: 'share-pnl', position: UserPositionsItemType) => void,
): ColumnDef<UserPositionsItemType, unknown> => ({
  id: 'pnlRoePc',

  header: () => (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild tabIndex={0}>
        <div
          className={classNames('font-medium underline lg:whitespace-nowrap')}
        >
          PNL / (ROE %)
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        className="!px-3 !bg-black/10 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
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
    const {
      state: { hidePnl },
    } = useUserSettingsState()
    if (!props.row.original.position.unrealizedPnl) {
      return '-'
    }
    const pnl = Number.parseFloat(
      props.row.original.position.unrealizedPnl ?? '0',
    )
    const entryPrice = Number.parseFloat(props.row.original.position.entryPx)
    const side = props.row.original.side === 'A' ? -1 : 1
    const size = Number.parseFloat(props.row.original.position.szi) * side
    const entryNotional = entryPrice * size
    const leverage = props.row.original.position.leverage.value
    const roePc = (pnl / entryNotional) * (leverage ?? 1) * 100

    return (
      <button
        type="button"
        className="flex items-center gap-0.5"
        onClick={() => openModal('share-pnl', props.row.original)}
      >
        <span
          className={classNames(
            'font-medium lg:whitespace-nowrap',
            getTextColorClass(pnl),
          )}
        >
          {hidePnl ? '' : getSignForValue(pnl)}
          {hidePnl ? '***' : `${currencyFormatter.format(pnl)} /`} (
          {getSignForValue(roePc)}
          {roePc.toFixed(1)}%)
        </span>
        <ExternalLinkIcon className="h-3.5 w-3.5 text-blue" />
      </button>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
})

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
    const val = formatPrice(
      liquidationPrice || '0',
      props.row.original.decimals || 6,
      'perp',
    )
    if (!liquidationPrice) {
      return <span className="font-medium lg:whitespace-nowrap">N/A</span>
    }
    return (
      <span className="font-medium lg:whitespace-nowrap">
        {perpsNumberFormatter({
          value: val,
        })}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
export const MARGIN_COLUMN = (
  openModal: (action: 'update-margin', position: UserPositionsItemType) => void,
): ColumnDef<UserPositionsItemType, unknown> => ({
  id: 'margin',
  header: () => (
    <HoverCard openDelay={0} closeDelay={0}>
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
        className="!px-3 !bg-black/10 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
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
      <button
        type="button"
        className="flex items-center gap-0.5"
        onClick={() => openModal('update-margin', props.row.original)}
      >
        <span className="font-medium lg:whitespace-nowrap capitalize">
          {currencyFormatter.format(Number.parseFloat(marginUsed ?? '0'))} (
          {marginType})
        </span>
        <PencilIcon className="w-4 h-4 text-blue" />
      </button>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
})

export const FUNDING_COLUMN: ColumnDef<UserPositionsItemType, unknown> = {
  id: 'funding',
  header: () => (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild tabIndex={0}>
        <div
          className={classNames('font-medium underline lg:whitespace-nowrap')}
        >
          Funding
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        className="!px-3 !bg-black/10 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
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
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild tabIndex={0}>
          <div
            className={classNames(
              'font-medium underline lg:whitespace-nowrap',
              getTextColorClass(sinceOpen >= 0 ? -1 : 1),
            )}
          >
            {getSignForValue(sinceOpen >= 0 ? -1 : 1)}
            {currencyFormatter.format(sinceOpen).replaceAll('-', '')}
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          side="top"
          className="!px-3 !bg-black/10 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
        >
          <p>
            All Time: {getSignForValue(allTime >= 0 ? -1 : 1)}
            {currencyFormatter.format(allTime).replaceAll('-', '')} Since Last
            Change: {getSignForValue(sinceChange >= 0 ? -1 : 1)}
            {currencyFormatter.format(sinceChange).replaceAll('-', '')}
          </p>
        </HoverCardContent>
      </HoverCard>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const CLOSE_COLUMN = (
  openModal: (
    action: 'limit-close' | 'market-close' | 'reverse',
    position: UserPositionsItemType,
  ) => void,
): ColumnDef<UserPositionsItemType, unknown> => ({
  id: 'close',
  header: () => <CloseAllPositionsDialog />,
  cell: (props) => {
    const position = props.row.original
    const {
      state: {
        quickCloseMarketPositionEnabled,
        quickCloseReversePositionEnabled,
      },
    } = useUserSettingsState()

    return (
      <div className="flex items-center gap-2">
        <TableButton onClick={() => openModal('limit-close', position)}>
          Limit
        </TableButton>
        {quickCloseMarketPositionEnabled ? (
          <MarketQuickClose position={position} />
        ) : (
          <TableButton onClick={() => openModal('market-close', position)}>
            Market
          </TableButton>
        )}
        {quickCloseReversePositionEnabled ? (
          <ReverseQuick position={position} />
        ) : (
          <TableButton onClick={() => openModal('reverse', position)}>
            Reverse
          </TableButton>
        )}
      </div>
    )
  },
  meta: {
    body: {
      className: '!p-0 !h-[25px] !max-h-[25px] !text-xs',
      skeleton: columnBodyMeta.skeleton,
    },
  },
})

export const TP_SL_COLUMN = (
  openModal: (action: 'edit-tpsl', position: UserPositionsItemType) => void,
): ColumnDef<UserPositionsItemType, unknown> => ({
  id: 'tpSl',
  header: 'TP/SL',
  cell: (props) => {
    const position = useMemo(() => props.row.original, [props.row.original])

    return (
      <div className="flex items-center gap-1 lg:whitespace-nowrap">
        <ViewOrders coin={position.position.coin} />
        <TableButton onClick={() => openModal('edit-tpsl', position)}>
          <PencilIcon className="w-4 h-4" />
        </TableButton>
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
})

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
