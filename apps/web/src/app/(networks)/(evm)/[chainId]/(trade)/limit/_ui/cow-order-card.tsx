'use client'

import { OrderStatus } from '@cowprotocol/cow-sdk'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Currency,
  LinkExternal,
  List,
  Progress,
  SkeletonCircle,
  classNames,
} from '@sushiswap/ui'
import { useState } from 'react'
import { getOrderPrice, getRemainingSellAmount } from 'src/lib/swap/cow/amounts'
import { type CowLimitChainId, getCowOrderLink } from 'src/lib/swap/cow/chains'
import { isCowOrderOpen } from 'src/lib/swap/cow/order'
import type { CowOrder } from 'src/lib/swap/cow/schema'
import type { EvmCurrency } from 'sushi/evm'
import { CowCancelOrder } from './cow-cancel-order'
import { formatCowTimestamp, formatCowTokenAmount } from './cow-format'
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

function TokenLabel({
  currency,
}: { currency: EvmCurrency | undefined }): React.JSX.Element {
  return (
    <span className="flex gap-1 items-center text-xs text-muted-foreground">
      {currency ? (
        <Currency.Icon currency={currency} width={14} height={14} />
      ) : (
        <SkeletonCircle radius={14} />
      )}
      {currency?.symbol}
    </span>
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
  const filled = Number(
    (BigInt(order.executedSellAmountBeforeFees) * 100n) /
      BigInt(order.sellAmount),
  )
  const status = STATUS[order.status]

  return (
    <Accordion
      type="single"
      collapsible
      value={expanded ? order.uid : ''}
      onValueChange={(value) => setExpanded(value === order.uid)}
    >
      <AccordionItem value={order.uid} className="border-0">
        <List.Control className="p-4 flex flex-col gap-2">
          <AccordionTrigger
            className="p-0 hover:no-underline"
            aria-label={`${sell?.symbol ?? 'Order'} ${status.label}`}
          >
            <div className="flex flex-1 flex-col gap-2 pr-2">
              <div className="flex items-center justify-between">
                <span className="text-xs">
                  {new Date(order.creationDate).toLocaleString()}
                </span>
                <span
                  className={classNames(
                    '!rounded-full px-2 text-[10px]',
                    status.className,
                  )}
                >
                  {status.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={filled} className="!h-2 flex-1" />
                <span className="text-xs text-muted-foreground">{filled}%</span>
              </div>
              <div className="flex gap-2 items-center">
                <TokenLabel currency={sell} />
                <ArrowRightIcon width={12} height={12} />
                <TokenLabel currency={buy} />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent forceMount className="data-[state=closed]:hidden">
            {sell && buy ? (
              <>
                <List.KeyValue title="Remaining">
                  {formatCowTokenAmount(sell, getRemainingSellAmount(order))}
                </List.KeyValue>
                <List.KeyValue title="Limit price">
                  {`${getOrderPrice(order, sell, buy).toSignificant(6)} ${buy.symbol} per ${sell.symbol}`}
                </List.KeyValue>
                <List.KeyValue title="Sold / received">
                  {`${formatCowTokenAmount(sell, order.executedSellAmount)} / ${formatCowTokenAmount(buy, order.executedBuyAmount)}`}
                </List.KeyValue>
              </>
            ) : (
              <List.KeyValue skeleton />
            )}
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
            {isCowOrderOpen(order) && (
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
          </AccordionContent>
        </List.Control>
      </AccordionItem>
    </Accordion>
  )
}
