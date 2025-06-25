import { getNetwork, OrderType, TwapFill } from '@orbs-network/twap-sdk'
import { TwapOrder } from '.'
import { Type } from 'sushi/currency'
import { formatUnits } from 'viem'

export const safeFormatUnits = (value: string, decimals?: number): number => {
  try {
    return Number(formatUnits(BigInt(value), decimals ?? 18))
  } catch (error) {
    return 0
  }
}
export const getTwapLimitOrders = (orders: TwapOrder[]) => {
  return orders.filter((order) => order.type === OrderType.LIMIT)
}

export const getTwapDcaOrders = (orders: TwapOrder[]) => {
  const keys = [OrderType.TWAP_MARKET, OrderType.TWAP_LIMIT]
  return orders.filter((order) => keys.includes(order.type))
}

export const formatDuration = (ms: number): string => {
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (ms >= day) {
    return `${Math.round(ms / day)} day(s)`
  } else if (ms >= hour) {
    return `${Math.round(ms / hour)} hour(s)`
  } else {
    return `${Math.round(ms / minute)} minute(s)`
  }
}



export const parseFill = (
  order: TwapOrder,
  fill: TwapFill,
  sellToken?: Type,
  buyToken?: Type
) => {
  return {
    timestamp: fill.timestamp,
    sellAmount: safeFormatUnits(fill.srcAmountIn, sellToken?.decimals),
    buyAmount: safeFormatUnits(fill.dstAmountOut, buyToken?.decimals),
    sellToken: sellToken,
    buyToken: buyToken,
    explorerUrl: `${getNetwork(order.chainId)?.explorer}/tx/${fill.transactionHash}`,
    txHash: fill.transactionHash,
    orderId: order.id,
    sellAmountUsd: Number(fill.dollarValueIn),
    buyAmountUsd: Number(fill.dollarValueOut),
  }
}

export const getPnl = (order: TwapOrder) => {
  if (!order.fills || order.fills?.length === 0) return null
  const receivedUsd =
    order.fills?.reduce((acc, fill) => acc + Number(fill.dollarValueOut), 0) ??
    0
  const costUsd =
    order.fills?.reduce((acc, fill) => acc + Number(fill.dollarValueIn), 0) ??
    0
  return receivedUsd - costUsd
}
