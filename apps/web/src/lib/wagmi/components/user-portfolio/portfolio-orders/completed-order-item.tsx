import { ArrowRightIcon } from '@heroicons/react-v1/solid'
import type { RecentSwap } from '@sushiswap/graph-client/data-api'
import { Currency, LinkExternal, classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { format } from 'date-fns'
import { type ReactNode, useMemo } from 'react'
import { NativeAddress } from 'src/lib/constants'
import { getChangeSign, getTextColor } from 'src/lib/helpers'
import { type TwapOrder, useParsedOrder } from 'src/lib/hooks/react-query/twap'
import { evmChains } from 'sushi'
import type { EvmChainId } from 'sushi/chain'
import { Native, Token } from 'sushi/currency'
import {
  formatNumber,
  formatPercent,
  formatUSD,
  shortenHash,
} from 'sushi/format'
import { getNetworkName } from '../../../../network'
import type { OrderItemType } from './completed-orders'

export const CompletedOrderItem = ({ order }: { order: OrderItemType }) => {
  const isTwap = Object.hasOwn(order, 'type') && 'type' in order

  return (
    <div className="dark:bg-slate-800 bg-slate-100 sm:bg-slate-50 rounded-xl flex flex-col gap-4 px-5 pt-3 pb-5">
      {isTwap ? (
        <TwapItem order={order as TwapOrder} />
      ) : (
        <MarketItem order={order as RecentSwap} />
      )}
    </div>
  )
}

const MarketItem = ({ order }: { order: RecentSwap }) => {
  const isCrossChain = order.tokenIn.chainId !== order.tokenOut.chainId
  const tokenIn = useMemo(() => {
    return order.tokenIn.address === NativeAddress
      ? Native.onChain(order.tokenIn.chainId as EvmChainId)
      : new Token({
          chainId: order.tokenIn.chainId as EvmChainId,
          address: order.tokenIn.address,
          decimals: order.tokenIn.decimals,
          symbol: order.tokenIn.symbol,
          name: order.tokenIn.name,
        })
  }, [order])

  const tokenOut = useMemo(() => {
    return order.tokenOut.address === NativeAddress
      ? Native.onChain(order.tokenOut.chainId as EvmChainId)
      : new Token({
          chainId: order.tokenOut.chainId as EvmChainId,
          address: order.tokenOut.address,
          decimals: order.tokenOut.decimals,
          symbol: order.tokenOut.symbol,
          name: order.tokenOut.name,
        })
  }, [order])

  return (
    <>
      <div className="flex items-center text-[#6B7280] gap-1 text-xs">
        <div className="flex items-center gap-1">
          <NetworkIcon chainId={tokenIn.chainId} width={14} height={14} />
          {getNetworkName(tokenIn.chainId)}
        </div>
        {isCrossChain ? (
          <>
            <ArrowRightIcon width={12} height={12} className="text-gray-500" />
            <div className="flex items-center gap-1">
              <NetworkIcon chainId={tokenOut.chainId} width={14} height={14} />
              {getNetworkName(tokenOut.chainId)}
            </div>
          </>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-3">
          <Item title="Bought">
            <Currency.Icon currency={tokenOut} width={24} height={24} />
            {formatNumber(order.amountOut)} {tokenOut.symbol}
          </Item>
          <Item title="Type">Market</Item>
          <Item title="Value/PnL">
            {formatUSD(order.amountOutUSD)}
            <span
              className={classNames('text-xs', getTextColor(order?.totalPnl))}
            >
              {getChangeSign(order?.totalPnl)}
              {formatUSD(order?.totalPnl)}
            </span>
          </Item>
          <Item title="Date">
            {format(new Date(order.time * 1000), 'MM/dd/yy h:mm a')}
          </Item>
        </div>
        <div className="flex flex-col gap-3">
          <Item title="Sold">
            <Currency.Icon currency={tokenIn} width={24} height={24} />
            {formatNumber(order.amountIn)} {tokenIn.symbol}
          </Item>
          <Item title="Price USD">{formatUSD(order.amountOutUSD)}</Item>
          <Item title="TX Hash">
            <LinkExternal href={evmChains[tokenIn.chainId]?.getTxUrl('')}>
              {'-'}
            </LinkExternal>
          </Item>
          <Item title="Status">Completed</Item>
        </div>
      </div>
    </>
  )
}
const TwapItem = ({ order }: { order: TwapOrder }) => {
  const parsedOrder = useParsedOrder(order)

  return (
    <>
      <div className="flex items-center text-[#6B7280] gap-1 text-xs">
        <div className="flex items-center gap-1">
          <NetworkIcon
            chainId={parsedOrder.chainInfo.id}
            width={14}
            height={14}
          />
          {getNetworkName(parsedOrder.chainInfo.id as EvmChainId)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-3">
          <Item title="Bought">
            {parsedOrder.buyToken ? (
              <Currency.Icon
                currency={parsedOrder.buyToken}
                width={24}
                height={24}
              />
            ) : null}
            {formatNumber(parsedOrder.buyTokenExpectedAmount)}{' '}
            {parsedOrder.buyToken?.symbol}
          </Item>
          <Item title="Type">{order.type === 'limit' ? 'Limit' : 'DCA'}</Item>
          <Item title="Value/PnL">
            {formatUSD(parsedOrder.sellTokenTotalUsdValue)}
            <span
              className={classNames(
                'text-xs',
                getTextColor(parsedOrder?.profitAndLoss || 0),
              )}
            >
              {getChangeSign(parsedOrder?.profitAndLoss || 0)}
              {formatUSD(parsedOrder?.profitAndLoss ?? 0)}
            </span>
          </Item>
          <Item title="Date">
            {format(new Date(order.createdAt), 'MM/dd/yy h:mm a')}
          </Item>
        </div>
        <div className="flex flex-col gap-3">
          <Item title="Sold">
            {parsedOrder.sellToken ? (
              <Currency.Icon
                currency={parsedOrder.sellToken}
                width={24}
                height={24}
              />
            ) : null}
            {formatNumber(parsedOrder.sellTokenTotalAmount)}{' '}
            {parsedOrder.sellToken?.symbol}
          </Item>
          <Item title="Price USD">{formatUSD(2603.98)}</Item>
          <Item title="TX Hash">
            <LinkExternal href={parsedOrder.transactionExplorerUrl}>
              {shortenHash(parsedOrder.transactionHash)}
            </LinkExternal>
          </Item>
          <Item title="Status">
            {formatPercent(parsedOrder.filledPercentage / 100)} Filled
          </Item>
        </div>
      </div>
    </>
  )
}

const Item = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-[#6B7280]">{title}</div>
      <div className="text-black dark:text-white text-sm font-medium flex items-center gap-1">
        {children}
      </div>
    </div>
  )
}
