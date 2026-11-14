'use client'

import { OrderStatus } from '@cowprotocol/cow-sdk'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Currency,
  LinkExternal,
  List,
  Progress,
  SkeletonCircle,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { useId, useState } from 'react'
import { getOrderPrice, getRemainingSellAmount } from 'src/lib/swap/cow/amounts'
import { type CowLimitChainId, getCowOrderLink } from 'src/lib/swap/cow/chains'
import { isCowOrderOpen } from 'src/lib/swap/cow/order'
import type { CowOrder } from 'src/lib/swap/cow/schema'
import type { EvmCurrency } from 'sushi/evm'
import { CowCancelOrder } from './cow-cancel-order'
import {
  formatCowDate,
  formatCowRelativeTime,
  formatCowTimestamp,
  formatCowTokenAmount,
} from './cow-format'
import { CowOrderFills } from './cow-order-fills'
import { useCowTokens } from './use-cow-tokens'

const STATUS: Record<OrderStatus, { label: string; className: string }> = {
  [OrderStatus.PRESIGNATURE_PENDING]: {
    label: 'Awaiting authorization',
    className: 'bg-yellow/20 text-yellow',
  },
  [OrderStatus.OPEN]: { label: 'Open', className: 'bg-blue/20 text-blue' },
  [OrderStatus.FULFILLED]: {
    label: 'Filled',
    className: 'bg-green/20 text-green',
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelled',
    className: 'bg-yellow/20 text-yellow',
  },
  [OrderStatus.EXPIRED]: {
    label: 'Expired',
    className: 'bg-muted text-muted-foreground',
  },
}

// Shared with the list header so desktop rows line up as a table.
export const COW_ORDER_ROW_COLUMNS =
  'lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_5.5rem_6.5rem] lg:gap-3'

function PairIcons({
  sell,
  buy,
}: {
  sell: EvmCurrency | undefined
  buy: EvmCurrency | undefined
}): React.JSX.Element {
  if (!sell || !buy) return <SkeletonCircle radius={28} />
  return (
    <Currency.IconList iconWidth={24} iconHeight={24}>
      <Currency.Icon currency={sell} disableLink />
      <Currency.Icon currency={buy} disableLink />
    </Currency.IconList>
  )
}

export function CowOrderCard({
  chainId,
  order,
  onEdit,
  disabled,
}: {
  chainId: CowLimitChainId
  order: CowOrder
  onEdit(order: CowOrder): void
  disabled: boolean
}): React.JSX.Element {
  const { sell, buy } = useCowTokens(chainId, order.sellToken, order.buyToken)
  const [expanded, setExpanded] = useState(false)
  const detailsId = useId()
  const filled = Number(
    (BigInt(order.executedSellAmountBeforeFees) * 100n) /
      BigInt(order.sellAmount),
  )
  const status = STATUS[order.status]
  const open = isCowOrderOpen(order)
  const price =
    sell && buy ? getOrderPrice(order, sell, buy).toSignificant(6) : undefined
  // Open orders count down to expiry; past ones show when they were placed.
  const time = open
    ? {
        label: formatCowRelativeTime(order.validTo),
        title: formatCowTimestamp(order.validTo),
      }
    : {
        label: formatCowDate(order.creationDate),
        title: formatCowTimestamp(order.creationDate),
      }

  return (
    <List.Control className="flex flex-col gap-2 p-3">
      <button
        type="button"
        className="flex w-full items-center gap-2 text-left"
        aria-expanded={expanded}
        aria-controls={detailsId}
        aria-label={`${sell?.symbol ?? 'Order'} → ${buy?.symbol ?? ''} ${status.label}`}
        onClick={() => setExpanded(!expanded)}
      >
        {/* A two-line card on mobile; on desktop, one table row aligned with
            the list's column header. */}
        <div
          className={classNames(
            COW_ORDER_ROW_COLUMNS,
            'grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1',
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <PairIcons sell={sell} buy={buy} />
            {sell && buy ? (
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">
                  {formatCowTokenAmount(sell, order.sellAmount)}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  → {formatCowTokenAmount(buy, order.buyAmount)}
                </span>
              </div>
            ) : (
              <SkeletonText fontSize="sm" className="w-2/3" />
            )}
          </div>
          <div className="order-last flex min-w-0 flex-col text-xs text-muted-foreground lg:order-none lg:text-sm lg:text-foreground">
            <span className="truncate">
              {price ? `${price} ${buy?.symbol}` : null}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {sell ? `per ${sell.symbol}` : null}
            </span>
          </div>
          <span
            className="order-last justify-self-end text-xs text-muted-foreground lg:order-none lg:justify-self-auto lg:text-sm lg:text-foreground"
            title={time.title}
          >
            {open && <span className="lg:hidden">Expires </span>}
            {time.label}
          </span>
          <div className="flex flex-col items-end gap-1 lg:items-start">
            <span
              className={classNames(
                'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
                status.className,
              )}
            >
              {status.label}
            </span>
            {open && filled > 0 && (
              <span className="text-xs text-muted-foreground">
                {filled}% filled
              </span>
            )}
          </div>
          {open && filled > 0 && (
            <Progress
              value={filled}
              className="order-last col-span-2 !h-1 lg:hidden"
            />
          )}
        </div>
        <ChevronDownIcon
          width={16}
          height={16}
          className={classNames(
            'shrink-0 text-muted-foreground transition-transform',
            expanded && 'rotate-180',
          )}
        />
      </button>
      {/* Hidden rather than unmounted, so an in-progress cancel survives a collapse. */}
      <div id={detailsId} hidden={!expanded} className="text-sm">
        {sell && buy ? (
          <>
            {open && (
              <List.KeyValue title="Remaining">
                {formatCowTokenAmount(sell, getRemainingSellAmount(order))}
              </List.KeyValue>
            )}
            <List.KeyValue title="Sold / received">
              {`${formatCowTokenAmount(sell, order.executedSellAmount)} / ${formatCowTokenAmount(buy, order.executedBuyAmount)}`}
            </List.KeyValue>
          </>
        ) : (
          <List.KeyValue skeleton />
        )}
        <List.KeyValue title="Created">
          {formatCowTimestamp(order.creationDate)}
        </List.KeyValue>
        <List.KeyValue title="Expires">
          {formatCowTimestamp(order.validTo)}
        </List.KeyValue>
        {expanded && <CowOrderFills chainId={chainId} order={order} />}
        <List.KeyValue title="Explorer">
          <LinkExternal
            className="text-blue hover:underline"
            href={getCowOrderLink(chainId, order.uid)}
          >
            CoW Explorer
          </LinkExternal>
        </List.KeyValue>
        {open && (
          <div className="flex flex-col gap-2 pt-2">
            {order.status === OrderStatus.OPEN && (
              <Button
                variant="secondary"
                disabled={disabled || !sell || !buy}
                onClick={() => onEdit(order)}
              >
                Edit order
              </Button>
            )}
            <CowCancelOrder
              chainId={chainId}
              order={order}
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </List.Control>
  )
}
