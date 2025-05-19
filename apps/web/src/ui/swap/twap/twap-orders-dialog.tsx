'use client'

import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import { type Order, OrderType } from '@orbs-network/twap-sdk'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Currency,
  Dialog,
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
  IconButton,
  List,
  Progress,
  SkeletonCircle,
  classNames,
  useDialog,
} from '@sushiswap/ui'
import format from 'date-fns/format'
import { type FC, type ReactNode, useMemo, useState } from 'react'
import type { TwapSupportedChainId } from 'src/config'
import { useTwapOrders } from 'src/lib/hooks/react-query/twap'
import { TwapSDK, fillDelayText } from 'src/lib/swap/twap'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { shortenAddress, shortenHash } from 'sushi'
import { EvmChain } from 'sushi/chain'
import { Amount, Token } from 'sushi/currency'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

enum OrderFilter {
  All = 'All',
  Open = 'Open',
  Canceled = 'Canceled',
  Completed = 'Completed',
  Expired = 'Expired',
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
        return orders.all ?? []
      case OrderFilter.Open:
        return orders.open ?? []
      case OrderFilter.Completed:
        return orders.completed ?? []
      case OrderFilter.Canceled:
        return orders.canceled ?? []
      case OrderFilter.Expired:
        return orders.expired ?? []
      default:
        return orders.all ?? []
    }
  }, [orders, orderFilter])

  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(
    undefined,
  )

  console.log('selectedOrder', selectedOrder)

  return (
    <DialogReview
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedOrder(undefined)
        }
      }}
    >
      {(_) => (
        <>
          {children}
          <DialogContent className="max-h-screen overflow-y-auto">
            {selectedOrder ? (
              <TwapOrderDialogContent
                order={selectedOrder}
                chainId={chainId}
                onBack={() => setSelectedOrder(undefined)}
              />
            ) : (
              <>
                <DialogTitle className="!text-[unset] !font-normal !leading-[unset] !tracking-[unset]">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2.5 text-sm bg-secondary rounded-xl">
                      {orderFilter}
                      <ChevronDownIcon width={14} height={14} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => setOrderFilter(OrderFilter.All)}
                          className="cursor-pointer"
                        >
                          All
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setOrderFilter(OrderFilter.Open)}
                          className="cursor-pointer"
                        >
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setOrderFilter(OrderFilter.Canceled)}
                          className="cursor-pointer"
                        >
                          Canceled
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setOrderFilter(OrderFilter.Completed)}
                          className="cursor-pointer"
                        >
                          Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setOrderFilter(OrderFilter.Expired)}
                          className="cursor-pointer"
                        >
                          Expired
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </DialogTitle>
                <List className="min-h-[420px]">
                  <div className="flex flex-col gap-4">
                    {isOrdersLoading ? (
                      <List.Control className="px-4 py-3">
                        <div className="text-sm text-center">Loading...</div>
                      </List.Control>
                    ) : filteredOrders.length ? (
                      filteredOrders.map((order) => (
                        <button
                          type="button"
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
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

const TwapOrderDialogContent = ({
  chainId,
  order,
  onBack,
}: { chainId: TwapSupportedChainId; order: Order; onBack: () => void }) => {
  const { address } = useAccount()
  const fillDelay = useMemo(
    () => order.getFillDelay(TwapSDK.onNetwork(chainId).config),
    [order, chainId],
  )

  const { data: token0 } = useTokenWithCache({
    chainId,
    address: order.srcTokenAddress as Address,
  })

  const { data: token1 } = useTokenWithCache({
    chainId,
    address: order.dstTokenAddress as Address,
  })

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
      srcAmount: token0
        ? Amount.fromRawAmount(token0, order.srcAmount)
        : undefined,
      srcChunkAmount: token0
        ? Amount.fromRawAmount(token0, order.srcBidAmount)
        : undefined,
      srcFilledAmount: token0
        ? Amount.fromRawAmount(token0, order.srcFilledAmount)
        : undefined,
      dstFilledAmount: token1
        ? Amount.fromRawAmount(token1, order.dstFilledAmount)
        : undefined,
      dstMinAmountOut: token1
        ? Amount.fromRawAmount(token1, order.dstMinAmount)
        : undefined,
      executionPrice:
        token0 && token1
          ? order.getExcecutionPrice(token0.decimals, token1.decimals)
          : undefined,
      limitPrice:
        token0 && token1
          ? order.getLimitPrice(token0.decimals, token1.decimals)
          : undefined,
    }
  }, [token0, token1, order])

  const isLimit = order.orderType === OrderType.LIMIT

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
              <span>{order.srcTokenSymbol}</span>
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
                <span>{order.dstTokenSymbol}</span>
              </div>
              {token1 ? (
                <Currency.Icon currency={token1} width={36} height={36} />
              ) : (
                <SkeletonCircle radius={36} />
              )}
            </div>
            {!isLimit ? (
              <span className="text-muted-foreground text-sm">
                Every {fillDelayText(fillDelay)} over {order.totalChunks} order
                {order.totalChunks > 1 ? 's' : ''}
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
                      {order.status}
                    </span>
                  </List.KeyValue>
                  <List.KeyValue className="!p-0" title="Amount sent">
                    <span className="text-muted-foreground">
                      {srcFilledAmount?.toSignificant(6)} {order.srcTokenSymbol}
                    </span>
                  </List.KeyValue>
                  <List.KeyValue className="!p-0" title="Amount received">
                    <span className="text-muted-foreground">
                      {dstFilledAmount?.toSignificant(6)} {order.dstTokenSymbol}
                    </span>
                  </List.KeyValue>
                  <List.KeyValue className="!p-0" title="Final execution price">
                    {executionPrice ? (
                      <span className="text-muted-foreground">
                        1 {order.srcTokenSymbol} = {executionPrice}{' '}
                        {order.dstTokenSymbol}
                      </span>
                    ) : null}
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
                        1 {order.srcTokenSymbol} = {limitPrice}{' '}
                        {order.dstTokenSymbol}
                      </span>
                    </List.KeyValue>
                  ) : null}
                  <List.KeyValue className="!p-0" title="Created at">
                    <span className="text-muted-foreground">
                      {format(order.createdAt, 'MMM d, yyyy HH:mm')}
                    </span>
                  </List.KeyValue>
                  <List.KeyValue className="!p-0" title="Expiry">
                    <span className="text-muted-foreground">
                      {format(order.deadline, 'MMM d, yyyy HH:mm')}
                    </span>
                  </List.KeyValue>
                  <List.KeyValue className="!p-0" title="Amount in">
                    <span className="text-muted-foreground">
                      {srcAmount?.toSignificant(6)} {order.srcTokenSymbol}
                    </span>
                  </List.KeyValue>
                  {!isLimit ? (
                    <>
                      <List.KeyValue
                        className="!p-0"
                        title="Individual trade size"
                      >
                        <span className="text-muted-foreground">
                          {srcChunkAmount?.toSignificant(6)}{' '}
                          {order.srcTokenSymbol}
                        </span>
                      </List.KeyValue>
                      <List.KeyValue className="!p-0" title="Trade interval">
                        <span className="text-muted-foreground">
                          {fillDelayText(fillDelay)}
                        </span>
                      </List.KeyValue>
                      <List.KeyValue className="!p-0" title="Number of trades">
                        <span className="text-muted-foreground">
                          {order.totalChunks}
                        </span>
                      </List.KeyValue>
                    </>
                  ) : null}
                  {!order.isMarketOrder ? (
                    <List.KeyValue
                      className="!p-0"
                      title={
                        order.totalChunks === 1
                          ? 'Min. received'
                          : 'Min. received per trade'
                      }
                    >
                      <span className="text-muted-foreground">
                        {dstMinAmountOut?.toSignificant(6)}{' '}
                        {order.dstTokenSymbol}
                      </span>
                    </List.KeyValue>
                  ) : null}
                  {address ? (
                    <List.KeyValue className="!p-0" title="Recipient">
                      <a
                        href={EvmChain.fromChainId(chainId)?.getAccountUrl(
                          address,
                        )}
                        className="text-muted-foreground hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {shortenAddress(address)}
                      </a>
                    </List.KeyValue>
                  ) : null}
                  <List.KeyValue className="!p-0" title="Transaction Hash">
                    <a
                      href={EvmChain.fromChainId(chainId)?.getTxUrl(
                        order.txHash,
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
      </div>
    </>
  )
}

const TwapOrderCard = ({
  chainId,
  order,
}: { chainId: TwapSupportedChainId; order: Order }) => (
  <List.Control className="p-4 flex flex-col gap-2 hover:opacity-80">
    <div className="flex items-center justify-between">
      <span className="text-xs">
        #{order.id} {order.orderType === OrderType.LIMIT ? 'Limit' : 'DCA'}{' '}
        <span className="text-muted-foreground">
          ({format(order.createdAt, 'MMM d, yyyy HH:mm')})
        </span>
      </span>
      <div
        className={classNames(
          '!rounded-full px-2 text-[10px] flex items-center',
          order.status === 'open'
            ? 'bg-blue/20 text-blue'
            : order.status === 'completed'
              ? 'bg-green/20 text-green'
              : order.status === 'canceled'
                ? 'bg-yellow/20 text-yellow'
                : order.status === 'expired'
                  ? 'bg-muted text-muted-foreground'
                  : '',
        )}
      >
        <span className="capitalize">{order.status}</span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Progress value={order.progress} className="!h-2 flex-1" />
      <span className="text-xs text-muted-foreground">{order.progress}%</span>
    </div>
    <div className="flex gap-2 items-center">
      <span className="flex gap-1 items-center text-xs text-muted-foreground">
        <Currency.Icon
          currency={useMemo(
            () =>
              new Token({
                chainId,
                address: order.srcTokenAddress,
                symbol: order.srcTokenSymbol,
                decimals: 0,
              }),
            [chainId, order.srcTokenAddress, order.srcTokenSymbol],
          )}
          width={14}
          height={14}
        />
        {order.srcTokenSymbol}
      </span>
      <ArrowRightIcon width={12} height={12} />
      <span className="flex gap-1 items-center text-xs text-muted-foreground">
        <Currency.Icon
          currency={useMemo(
            () =>
              new Token({
                chainId,
                address: order.dstTokenAddress,
                symbol: order.dstTokenSymbol,
                decimals: 0,
              }),
            [chainId, order.dstTokenAddress, order.dstTokenSymbol],
          )}
          width={14}
          height={14}
        />
        {order.dstTokenSymbol}
      </span>
    </div>
  </List.Control>
)

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
