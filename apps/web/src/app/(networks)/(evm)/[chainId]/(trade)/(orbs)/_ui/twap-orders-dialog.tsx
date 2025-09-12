'use client'

import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import {
  OrderStatus,
  OrderType,
  getOrderExcecutionRate,
  getOrderLimitPriceRate,
  zeroAddress,
} from '@orbs-network/twap-sdk'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Currency,
  DialogContent,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
  DialogType,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  FormattedNumber,
  IconButton,
  List,
  Progress,
  SkeletonCircle,
  classNames,
  useDialog,
} from '@sushiswap/ui'
import format from 'date-fns/format'
import { type FC, type ReactNode, useEffect, useMemo, useState } from 'react'
import type { TwapSupportedChainId } from 'src/config'
import { type TwapOrder, useTwapOrders } from 'src/lib/hooks/react-query/twap'
import { fillDelayText } from 'src/lib/swap/twap'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { Amount, withoutScientificNotation } from 'sushi'
import {
  type EvmCurrency,
  EvmNative,
  getEvmChainById,
  shortenEvmAddress,
  shortenHash,
} from 'sushi/evm'
import type { Address, Hex } from 'viem'
import { useAccount } from 'wagmi'
import { useDerivedStateTwap } from './derivedstate-twap-provider'
import { TwapCancelOrderButton } from './twap-cancel-order-button'

enum OrderFilter {
  All = 'ALL',
  Open = 'OPEN',
  Canceled = 'CANCELED',
  Completed = 'COMPLETED',
  Expired = 'EXPIRED',
}

const TwapOrdersDialog: FC<{
  children: ReactNode
}> = ({ children }) => {
  return (
    <DialogProvider>
      <_TwapOrdersDialog>{children}</_TwapOrdersDialog>
    </DialogProvider>
  )
}

const _TwapOrdersDialog: FC<{
  children: ReactNode
}> = ({ children }) => {
  const { open } = useDialog(DialogType.Review)

  const {
    state: { chainId },
  } = useDerivedStateTwap()

  const { address } = useAccount()

  const { data: orders, isLoading: isOrdersLoading } = useTwapOrders({
    chainId,
    account: address,
    enabled: open,
  })

  const [orderFilter, setOrderFilter] = useState<OrderFilter>(OrderFilter.All)

  const filteredOrders = useMemo(() => {
    if (!orders) return []

    switch (orderFilter) {
      case OrderFilter.All:
        return orders.ALL
      case OrderFilter.Open:
        return orders.OPEN
      case OrderFilter.Completed:
        return orders.COMPLETED
      case OrderFilter.Canceled:
        return orders.CANCELED
      case OrderFilter.Expired:
        return orders.EXPIRED
      default:
        return orders.ALL
    }
  }, [orders, orderFilter])

  const [selectedOrderIndex, setSelectedOrderIndex] = useState<
    number | undefined
  >(undefined)

  useEffect(() => {
    !open && setSelectedOrderIndex(undefined)
  }, [open])

  return (
    <DialogReview>
      {(_) => (
        <>
          {children}
          <DialogContent className="max-h-screen overflow-y-auto">
            {typeof selectedOrderIndex === 'number' ? (
              <TwapOrderDialogContent
                order={filteredOrders[selectedOrderIndex]}
                chainId={chainId}
                onBack={() => setSelectedOrderIndex(undefined)}
              />
            ) : (
              <>
                <DialogTitle className="!text-[unset] !font-normal !leading-[unset] !tracking-[unset]">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2.5 text-sm bg-secondary rounded-xl capitalize">
                      {orderFilter.toLowerCase()}
                      <ChevronDownIcon width={14} height={14} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuGroup>
                        {Object.entries(OrderFilter).map(([label, value]) => (
                          <DropdownMenuItem
                            key={value}
                            onClick={() => setOrderFilter(value)}
                            className="cursor-pointer"
                          >
                            {label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </DialogTitle>
                <List className="min-h-[420px] max-h-[75vh] overflow-y-auto">
                  <div className="flex flex-col gap-4">
                    {isOrdersLoading ? (
                      <List.Control className="px-4 py-3">
                        <div className="text-sm text-center">Loading...</div>
                      </List.Control>
                    ) : filteredOrders.length ? (
                      filteredOrders.map((order, i) => (
                        <button
                          type="button"
                          key={order.id}
                          onClick={() => setSelectedOrderIndex(i)}
                        >
                          <TwapOrderCard order={order} chainId={chainId} />
                        </button>
                      ))
                    ) : (
                      <List.Control className="px-4 py-3">
                        <div className="text-sm text-center">
                          No orders found
                        </div>
                      </List.Control>
                    )}
                  </div>
                </List>
              </>
            )}
          </DialogContent>
        </>
      )}
    </DialogReview>
  )
}

function parseOrderAmount(
  currency: EvmCurrency | undefined,
  orderAmount: string,
): Amount<EvmCurrency> | undefined {
  const amount = withoutScientificNotation(orderAmount)
  if (!currency || !amount) return undefined
  return new Amount(currency, amount)
}

const TwapOrderDialogContent = ({
  chainId,
  order,
  onBack,
}: { chainId: TwapSupportedChainId; order: TwapOrder; onBack: () => void }) => {
  const { address } = useAccount()

  const isLimit = order.type === OrderType.LIMIT

  const { data: token0 } = useTokenWithCache({
    chainId,
    address: order.srcTokenAddress as Address,
  })

  const { data: _token1 } = useTokenWithCache({
    chainId,
    address: order.dstTokenAddress as Address,
    enabled: order.dstTokenAddress !== zeroAddress,
  })

  const token1 = useMemo(
    () =>
      order.dstTokenAddress === zeroAddress
        ? EvmNative.fromChainId(chainId)
        : _token1,
    [order, chainId, _token1],
  )

  const {
    srcAmount,
    srcChunkAmount,
    srcFilledAmount,
    dstFilledAmount,
    dstMinAmountOut,
    executionPrice,
    limitPrice,
  } = useMemo(() => {
    return {
      srcAmount: parseOrderAmount(token0, order.srcAmount),
      srcChunkAmount: parseOrderAmount(token0, order.srcAmountPerChunk),
      srcFilledAmount: parseOrderAmount(token0, order.filledSrcAmount),
      dstFilledAmount: parseOrderAmount(token1, order.filledDstAmount),
      dstMinAmountOut: parseOrderAmount(token1, order.dstMinAmount),
      executionPrice:
        token0 && token1
          ? getOrderExcecutionRate(order, token0.decimals, token1.decimals)
          : undefined,
      limitPrice:
        token0 && token1
          ? getOrderLimitPriceRate(order, token0.decimals, token1.decimals)
          : undefined,
    }
  }, [token0, token1, order])

  return (
    <>
      <DialogTitle className="flex gap-4 items-center">
        <IconButton icon={ArrowLeftIcon} name="Close" onClick={onBack} />
        {isLimit ? 'Limit' : 'DCA'} Order #{order.id}
      </DialogTitle>
      <div className="flex flex-col gap-4">
        <List.Control className="p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Sell</span>
              <span>{token0?.symbol}</span>
            </div>
            {token0 ? (
              <Currency.Icon currency={token0} width={36} height={36} />
            ) : (
              <SkeletonCircle radius={36} />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-center gap-4">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Buy</span>
                <span>{token1?.symbol}</span>
              </div>
              {token1 ? (
                <Currency.Icon currency={token1} width={36} height={36} />
              ) : (
                <SkeletonCircle radius={36} />
              )}
            </div>
            {!isLimit ? (
              <span className="text-muted-foreground text-sm">
                {`Every ${fillDelayText(order.fillDelayMs)} over ${order.chunks} order${order.chunks > 1 ? 's' : ''}`}
              </span>
            ) : null}
          </div>
        </List.Control>
        <Accordion
          type="multiple"
          defaultValue={['execution-summary']}
          className="flex flex-col gap-4"
        >
          <List.Control className="p-4">
            <AccordionItem
              value="execution-summary"
              className="!border-0"
              defaultChecked
            >
              <AccordionTrigger className="!p-0 hover:no-underline">
                Execution Summary
              </AccordionTrigger>
              <AccordionContent>
                <List className="!gap-2">
                  <List.KeyValue className="!p-0" title="Status">
                    <span className="capitalize text-muted-foreground">
                      {order.status.toLowerCase()}
                    </span>
                  </List.KeyValue>
                  <List.KeyValue className="!p-0" title="Amount sent">
                    <span className="text-muted-foreground">
                      {srcFilledAmount?.toSignificant(6)} {token0?.symbol}
                    </span>
                  </List.KeyValue>
                  <List.KeyValue className="!p-0" title="Amount received">
                    <span className="text-muted-foreground">
                      {dstFilledAmount?.toSignificant(6)} {token1?.symbol}
                    </span>
                  </List.KeyValue>
                  <List.KeyValue className="!p-0" title="Final execution price">
                    {executionPrice ? (
                      <span className="text-muted-foreground">
                        1 {token0?.symbol} ={' '}
                        <FormattedNumber number={executionPrice} />{' '}
                        {token1?.symbol}
                      </span>
                    ) : (
                      '-'
                    )}
                  </List.KeyValue>
                </List>
              </AccordionContent>
            </AccordionItem>
          </List.Control>
          <List.Control className="p-4">
            <AccordionItem value="order-info" className="!border-0">
              <AccordionTrigger className="!p-0 hover:no-underline">
                Order Info
              </AccordionTrigger>
              <AccordionContent>
                <List className="!gap-2">
                  {!order.isMarketOrder ? (
                    <List.KeyValue className="!p-0" title="Limit Price">
                      <span className="text-muted-foreground">
                        1 {token0?.symbol} ={' '}
                        <FormattedNumber number={limitPrice} /> {token1?.symbol}
                      </span>
                    </List.KeyValue>
                  ) : null}
                  <List.KeyValue className="!p-0" title="Created at">
                    <span className="text-muted-foreground">
                      {format(order.createdAt, 'MMM d, yyyy h:mm a')}
                    </span>
                  </List.KeyValue>
                  <List.KeyValue className="!p-0" title="Expiry">
                    <span className="text-muted-foreground">
                      {format(order.deadline, 'MMM d, yyyy h:mm a')}
                    </span>
                  </List.KeyValue>
                  <List.KeyValue className="!p-0" title="Amount in">
                    <span className="text-muted-foreground">
                      {srcAmount?.toSignificant(6)} {token0?.symbol}
                    </span>
                  </List.KeyValue>
                  {!isLimit ? (
                    <>
                      <List.KeyValue
                        className="!p-0"
                        title="Individual trade size"
                      >
                        <span className="text-muted-foreground">
                          {srcChunkAmount?.toSignificant(6)} {token0?.symbol}
                        </span>
                      </List.KeyValue>
                      <List.KeyValue className="!p-0" title="Trade interval">
                        <span className="text-muted-foreground">
                          {fillDelayText(order.fillDelayMs)}
                        </span>
                      </List.KeyValue>
                      <List.KeyValue className="!p-0" title="Number of trades">
                        <span className="text-muted-foreground">
                          {order.chunks}
                        </span>
                      </List.KeyValue>
                    </>
                  ) : null}
                  {!order.isMarketOrder ? (
                    <List.KeyValue
                      className="!p-0"
                      title={
                        order.chunks === 1
                          ? 'Min. received'
                          : 'Min. received per trade'
                      }
                    >
                      <span className="text-muted-foreground">
                        {dstMinAmountOut?.toSignificant(6)} {token1?.symbol}
                      </span>
                    </List.KeyValue>
                  ) : null}
                  {address ? (
                    <List.KeyValue className="!p-0" title="Recipient">
                      <a
                        href={getEvmChainById(chainId).getAccountUrl(address)}
                        className="text-muted-foreground hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {shortenEvmAddress(address)}
                      </a>
                    </List.KeyValue>
                  ) : null}
                  <List.KeyValue className="!p-0" title="Transaction Hash">
                    <a
                      href={getEvmChainById(chainId).getTransactionUrl(
                        order.txHash as Hex,
                      )}
                      className="text-muted-foreground hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {shortenHash(order.txHash)}
                    </a>
                  </List.KeyValue>
                </List>
              </AccordionContent>
            </AccordionItem>
          </List.Control>
        </Accordion>
        {order.status === OrderStatus.Open ? (
          <TwapCancelOrderButton chainId={chainId} order={order} />
        ) : null}
      </div>
    </>
  )
}

const TwapOrderCard = ({
  chainId,
  order,
}: { chainId: TwapSupportedChainId; order: TwapOrder }) => {
  const { data: token0 } = useTokenWithCache({
    chainId,
    address: order.srcTokenAddress as Address,
  })

  const { data: _token1 } = useTokenWithCache({
    chainId,
    address: order.dstTokenAddress as Address,
    enabled: order.dstTokenAddress !== zeroAddress,
  })

  const token1 = useMemo(
    () =>
      order.dstTokenAddress === zeroAddress
        ? EvmNative.fromChainId(chainId)
        : _token1,
    [order, chainId, _token1],
  )

  return (
    <List.Control className="p-4 flex flex-col gap-2 hover:opacity-80">
      <div className="flex items-center justify-between">
        <span className="text-xs">
          #{order.id} {order.type === OrderType.LIMIT ? 'Limit' : 'DCA'}{' '}
          <span className="text-muted-foreground">
            ({format(order.createdAt, 'MMM d, yyyy h:mm a')})
          </span>
        </span>
        <div
          className={classNames(
            '!rounded-full px-2 text-[10px] flex items-center',
            order.status === OrderStatus.Open
              ? 'bg-blue/20 text-blue'
              : order.status === OrderStatus.Completed
                ? 'bg-green/20 text-green'
                : order.status === OrderStatus.Canceled
                  ? 'bg-yellow/20 text-yellow'
                  : order.status === OrderStatus.Expired
                    ? 'bg-muted text-muted-foreground'
                    : '',
          )}
        >
          <span className="capitalize">{order.status.toLowerCase()}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={order.progress} className="!h-2 flex-1" />
        <span className="text-xs text-muted-foreground">{order.progress}%</span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="flex gap-1 items-center text-xs text-muted-foreground">
          {token0 ? (
            <Currency.Icon currency={token0} width={14} height={14} />
          ) : (
            <SkeletonCircle radius={14} />
          )}
          {token0?.symbol}
        </span>
        <ArrowRightIcon width={12} height={12} />
        <span className="flex gap-1 items-center text-xs text-muted-foreground">
          {token1 ? (
            <Currency.Icon currency={token1} width={14} height={14} />
          ) : (
            <SkeletonCircle radius={14} />
          )}
          {token1?.symbol}
        </span>
      </div>
    </List.Control>
  )
}

export const TwapOrdersDialogTriggerButton = () => {
  const { address } = useAccount()
  return (
    <TwapOrdersDialog>
      <DialogTrigger asChild>
        <Button fullWidth size="xl" variant="secondary" disabled={!address}>
          Orders
        </Button>
      </DialogTrigger>
    </TwapOrdersDialog>
  )
}
