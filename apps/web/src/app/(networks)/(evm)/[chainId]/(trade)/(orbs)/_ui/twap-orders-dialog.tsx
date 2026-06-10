'use client'

import { ChevronRightIcon } from '@heroicons/react-v1/solid'
import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import {
  type Token as OrbsToken,
  type Order,
  OrderStatus,
  getExplorerUrl,
  useDerivedHistoryOrder,
  useOrderHistoryPanel,
} from '@orbs-network/spot-react'
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
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { SupportedChainId } from 'src/config'
import { ORBS_EXPLORER_URL } from 'src/lib/swap/twap'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import {
  type EvmAddress,
  type EvmChainId,
  type EvmCurrency,
  EvmNative,
  shortenHash,
} from 'sushi/evm'
import { type Address, type Hex, zeroAddress } from 'viem'
import { useConnection } from 'wagmi'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'
import { getTwapOrderTitle } from './helper'
import { TwapCancelOrderButton } from './twap-cancel-order-button'
import { TwapOrderDetails } from './twap-order-details'

const ORDER_FILTERS = [
  { value: 'all', text: 'All orders' },
  { value: 'open', text: 'Open orders' },
  { value: 'completed', text: 'Completed orders' },
  { value: 'cancelled', text: 'Cancelled orders' },
  { value: 'expired', text: 'Expired orders' },
] as const

type OrderFilterValue = (typeof ORDER_FILTERS)[number]['value']
type SelectedOrder = NonNullable<ReturnType<typeof useDerivedHistoryOrder>>

const MinDstAmountRow = ({
  totalTrades,
  minDestAmountPerTrade,
  tokenSymbol,
  valueClassName,
}: {
  totalTrades?: number
  minDestAmountPerTrade?: string | number
  tokenSymbol?: string
  valueClassName?: string
}) => {
  if (!minDestAmountPerTrade || minDestAmountPerTrade === '0') return null
  return (
    <List.KeyValue
      className="!p-0"
      title={totalTrades === 1 ? 'Min. received' : 'Min. received per trade'}
    >
      <span className={valueClassName}>
        <FormattedNumber number={minDestAmountPerTrade} /> {tokenSymbol}
      </span>
    </List.KeyValue>
  )
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
  } = useDerivedStateSimpleSwap()

  const {
    isLoading: isOrdersLoading,
    isRefetching: isOrdersRefetching,
    orders,
  } = useOrderHistoryPanel()
  const [selectedOrderId, setSelectedOrderId] = useState<string>()
  const [selectedOrderFilterValue, setSelectedOrderFilterValue] =
    useState<OrderFilterValue>('all')
  const [showOrderFills, setShowOrderFills] = useState(false)

  const selectedOrderFilter = useMemo(
    () =>
      ORDER_FILTERS.find(
        (filter) => filter.value === selectedOrderFilterValue,
      ) ?? ORDER_FILTERS[0],
    [selectedOrderFilterValue],
  )
  const selectedOrders = orders[selectedOrderFilterValue]
  const selectedOrder = useMemo(
    () =>
      orders.all.find(
        (order) =>
          order.id === selectedOrderId || order.hash === selectedOrderId,
      ),
    [orders.all, selectedOrderId],
  )

  useEffect(() => {
    if (!open) {
      setShowOrderFills(false)
      setSelectedOrderId(undefined)
    }
  }, [open])

  const onBack = useCallback(() => {
    if (showOrderFills) {
      setShowOrderFills(false)
    } else {
      setSelectedOrderId(undefined)
    }
  }, [showOrderFills])

  return (
    <DialogReview>
      {(_) => (
        <>
          {children}
          <DialogContent className="max-h-screen overflow-y-auto">
            {selectedOrder ? (
              <TwapOrderDialogContent
                onBack={onBack}
                selectedOrder={selectedOrder}
                showOrderFills={showOrderFills}
                onShowOrderFills={() => setShowOrderFills(true)}
              />
            ) : (
              <>
                <DialogTitle className="!text-[unset] !font-normal !leading-[unset] !tracking-[unset]">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2.5 text-sm bg-secondary rounded-xl capitalize">
                      {selectedOrderFilter.text}
                      <ChevronDownIcon width={14} height={14} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuGroup>
                        {ORDER_FILTERS.map((filter) => (
                          <DropdownMenuItem
                            key={filter.value}
                            onClick={() =>
                              setSelectedOrderFilterValue(filter.value)
                            }
                            className="cursor-pointer"
                          >
                            {filter.text}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </DialogTitle>
                <List className="min-h-[420px] max-h-[75vh] overflow-y-auto">
                  <div className="flex flex-col gap-4">
                    {isOrdersLoading || isOrdersRefetching ? (
                      <List.Control className="px-4 py-3">
                        <div className="text-sm text-center">Loading...</div>
                      </List.Control>
                    ) : selectedOrders.length ? (
                      selectedOrders.map((order) => (
                        <button
                          type="button"
                          key={order.id}
                          onClick={() => setSelectedOrderId(order.id)}
                        >
                          <TwapOrderCard
                            order={order}
                            chainId={chainId as EvmChainId}
                          />
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

const useOrderTokens = (order: Order) => {
  const {
    state: { chainId },
  } = useDerivedStateSimpleSwap<SupportedChainId & EvmChainId>()

  const srcTokenAddress = order.srcTokenAddress as EvmAddress
  const dstTokenAddress = order.dstTokenAddress as EvmAddress

  const { data: token0 } = useTokenWithCache({
    chainId,
    address: srcTokenAddress,
  })

  const { data: _token1 } = useTokenWithCache({
    chainId,
    address: dstTokenAddress,
    enabled: dstTokenAddress !== zeroAddress,
  })

  const token1 = useMemo(
    () =>
      dstTokenAddress === zeroAddress
        ? EvmNative.fromChainId(chainId)
        : _token1,
    [dstTokenAddress, chainId, _token1],
  )

  return { token0, token1 }
}

function toOrbsToken(currency?: EvmCurrency): OrbsToken | undefined {
  if (!currency) return undefined

  return {
    address: currency.isNative ? zeroAddress : currency.wrap().address,
    symbol: currency.symbol,
    decimals: currency.decimals,
    logoUrl: '',
  }
}

const TwapOrderDialogContent = ({
  onBack,
  selectedOrder: order,
  showOrderFills,
  onShowOrderFills,
}: {
  onBack: () => void
  selectedOrder: Order
  showOrderFills: boolean
  onShowOrderFills: () => void
}) => {
  const {
    state: { chainId },
  } = useDerivedStateSimpleSwap<SupportedChainId & EvmChainId>()

  const { token0, token1 } = useOrderTokens(order)
  const selectedOrder = useDerivedHistoryOrder(
    order,
    toOrbsToken(token0),
    toOrbsToken(token1),
  )
  const orderTitle = useMemo(() => {
    const title = getTwapOrderTitle(selectedOrder?.orderType)
    if (showOrderFills) {
      return `${title} Order fills`
    }
    return `${title} Order`
  }, [selectedOrder?.orderType, showOrderFills])

  if (!selectedOrder) return null

  const totalChunks = Number(selectedOrder.totalTrades)
  const tradeIntervalMs = Number(selectedOrder.tradeInterval)
  const txHash = selectedOrder.original.txHash || selectedOrder.original.hash
  const isV1 = selectedOrder.original.version === 1

  return (
    <>
      <DialogTitle className="flex gap-4 items-center">
        <IconButton icon={ArrowLeftIcon} name="Close" onClick={onBack} />
        {orderTitle}
      </DialogTitle>
      {showOrderFills ? (
        <OrderFills order={selectedOrder} />
      ) : (
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
              {totalChunks > 1 && (
                <span className="text-muted-foreground text-sm">
                  <TwapOrderDetails.DcaChunksRow
                    orderType={selectedOrder.orderType}
                    fillDelay={tradeIntervalMs}
                    totalTrades={totalChunks}
                  />
                </span>
              )}
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
                        {selectedOrder.original.status.toLowerCase()}
                      </span>
                    </List.KeyValue>
                    <List.KeyValue className="!p-0" title="Amount sent">
                      <span className="text-muted-foreground">
                        <FormattedNumber
                          number={selectedOrder.amountInFilledUI}
                        />{' '}
                        {token0?.symbol}
                      </span>
                    </List.KeyValue>
                    <List.KeyValue className="!p-0" title="Amount received">
                      <span className="text-muted-foreground">
                        <FormattedNumber
                          number={selectedOrder.amountOutFilledUI}
                        />{' '}
                        {token1?.symbol}
                      </span>
                    </List.KeyValue>
                    <List.KeyValue
                      className="!p-0"
                      title="Final execution price"
                    >
                      <TwapOrderDetails.PriceRateRow
                        price={selectedOrder.executionPriceUI}
                        usd=""
                        fromSymbol={token0?.symbol}
                        toSymbol={token1?.symbol}
                        className="text-muted-foreground"
                      />
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
                    <TwapOrderDetails.LimitPrice
                      limitPrice={selectedOrder.limitPriceUI}
                      fromSymbol={token0?.symbol}
                      toSymbol={token1?.symbol}
                      valueClassName="text-muted-foreground"
                    />
                    <TwapOrderDetails.StartDate
                      startDate={selectedOrder.original.createdAt}
                      valueClassName="text-muted-foreground"
                    />
                    <TwapOrderDetails.EndDate
                      endDate={selectedOrder.original.deadline}
                      valueClassName="text-muted-foreground"
                    />
                    <TwapOrderDetails.SellTotal
                      inputAmount={selectedOrder.srcAmountUI}
                      inputSymbol={token0?.symbol}
                      valueClassName="text-muted-foreground"
                    />

                    {totalChunks > 1 && (
                      <TwapOrderDetails.SellPerOrder
                        title="Individual trade size"
                        amountInPerChunk={selectedOrder.sizePerTradeUI}
                        inputSymbol={token0?.symbol}
                        valueClassName="text-muted-foreground"
                      />
                    )}

                    {totalChunks > 1 && (
                      <TwapOrderDetails.TradeInterval
                        fillDelay={tradeIntervalMs}
                        valueClassName="text-muted-foreground"
                      />
                    )}
                    {totalChunks > 1 && (
                      <TwapOrderDetails.NumberOfOrders
                        totalChunks={totalChunks}
                        valueClassName="text-muted-foreground"
                      />
                    )}

                    <MinDstAmountRow
                      totalTrades={totalChunks}
                      minDestAmountPerTrade={
                        selectedOrder.minDestAmountPerTradeUI
                      }
                      tokenSymbol={token1?.symbol}
                      valueClassName="text-muted-foreground"
                    />
                    <TwapOrderDetails.Recipient
                      recipient={selectedOrder.recipient as Address}
                      chainId={chainId}
                      valueClassName="text-muted-foreground hover:underline"
                    />
                    <List.KeyValue
                      className="!p-0"
                      title={isV1 ? 'Transaction Hash' : 'Order ID'}
                    >
                      {isV1 ? (
                        <a
                          href={
                            isV1
                              ? `${getExplorerUrl(txHash, chainId)}/tx/${txHash}`
                              : `${ORBS_EXPLORER_URL}/twap/order/${txHash}`
                          }
                          className="text-muted-foreground hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {txHash.startsWith('0x')
                            ? shortenHash(txHash as Hex)
                            : txHash}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">
                          {txHash.startsWith('0x')
                            ? shortenHash(txHash as Hex)
                            : txHash}
                        </span>
                      )}
                    </List.KeyValue>
                  </List>
                </AccordionContent>
              </AccordionItem>
            </List.Control>
          </Accordion>
          <Button
            onClick={onShowOrderFills}
            variant="secondary"
            className="flex items-center justify-between"
          >
            <span>View Order Fills ({selectedOrder.fills?.length})</span>
            <ChevronRightIcon width={18} height={18} />
          </Button>
          {selectedOrder.original.status === OrderStatus.Open ? (
            <TwapCancelOrderButton
              chainId={chainId}
              order={selectedOrder.original}
            />
          ) : null}
        </div>
      )}
    </>
  )
}

const OrderFills = ({ order }: { order: SelectedOrder }) => {
  const { token0, token1 } = useOrderTokens(order.original)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-start items-center gap-2">
        <Currency.IconList iconWidth={36} iconHeight={36}>
          {token0 && <Currency.Icon currency={token0} />}
          {token0 && token1 && <Currency.Icon currency={token1} />}
        </Currency.IconList>
        <span className="text-sm text-muted-foreground">
          {token0?.symbol} / {token1?.symbol}
        </span>
      </div>
      {!order.fills?.length ? (
        <List.Control className="p-4 flex flex-col gap-2 hover:opacity-80">
          <div className="text-md text-muted-foreground text-center mt-5 mb-5">
            No order fills found
          </div>
        </List.Control>
      ) : (
        order.fills.map((fill, index) => {
          return (
            <List.Control
              className="p-4 flex flex-col gap-2 hover:opacity-80"
              key={fill.txHash}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs">Fill #{index + 1}</span>
              </div>
              <List>
                <List.KeyValue className="!p-0" title="Amount sent">
                  <span className="text-muted-foreground">
                    <FormattedNumber number={fill.srcAmount} />{' '}
                    {order.srcToken?.symbol}
                  </span>
                </List.KeyValue>
                <List.KeyValue className="!p-0" title="Amount received">
                  <span className="text-muted-foreground">
                    <FormattedNumber number={fill.dstAmount} />{' '}
                    {order.dstToken?.symbol}
                  </span>
                </List.KeyValue>
                <List.KeyValue className="!p-0" title="Timestamp">
                  <span className="text-muted-foreground">
                    <TwapOrderDetails.Date date={fill.timestamp} />
                  </span>
                </List.KeyValue>
                <List.KeyValue className="!p-0" title="Execution price">
                  <span className="text-muted-foreground">
                    <TwapOrderDetails.PriceRateRow
                      price={fill.executionRate}
                      fromSymbol={order.srcToken?.symbol}
                      toSymbol={order.dstToken?.symbol}
                      className="text-muted-foreground"
                    />
                  </span>
                </List.KeyValue>

                <List.KeyValue className="!p-0" title="Transaction Hash">
                  <span className="text-muted-foreground">
                    <a
                      href={fill.explorerUrl}
                      className="text-muted-foreground hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {fill.txHash.startsWith('0x')
                        ? shortenHash(fill.txHash as Hex)
                        : fill.txHash}
                    </a>
                  </span>
                </List.KeyValue>
              </List>
            </List.Control>
          )
        })
      )}
    </div>
  )
}

const TwapOrderCard = ({
  chainId,
  order,
}: {
  chainId: EvmChainId
  order: Order
}) => {
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
          {getTwapOrderTitle(order.type)}{' '}
          <TwapOrderDetails.Date date={order.createdAt} />
        </span>
        <div
          className={classNames(
            '!rounded-full px-2 text-[10px] flex items-center',
            order.status === OrderStatus.Open
              ? 'bg-blue/20 text-blue'
              : order.status === OrderStatus.Completed
                ? 'bg-green/20 text-green'
                : order.status === OrderStatus.Cancelled
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
  const { address } = useConnection()
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
