import { OrderType, Partners, getConfig } from '@orbs-network/spot-react'

export const getTwapOrderTitle = (orderType?: OrderType) => {
  if (!orderType) return 'DCA'

  switch (orderType) {
    case OrderType.STOP_LOSS_LIMIT:
      return 'Stop-Loss Limit'
    case OrderType.TAKE_PROFIT:
      return 'Take-Profit'
    case OrderType.TWAP_LIMIT:
      return 'DCA'
    case OrderType.TWAP_MARKET:
      return 'DCA Market'
    case OrderType.LIMIT:
      return 'Limit'
    default:
      return 'DCA'
  }
}

export const isLimitPriceOrder = (orderType?: OrderType) => {
  return (
    orderType === OrderType.TWAP_LIMIT ||
    orderType === OrderType.LIMIT ||
    orderType === OrderType.STOP_LOSS_LIMIT
  )
}

export const getTwapConfig = (chainId: number) => {
  return getConfig(Partners.Sushiswap, chainId)
}

export function formatDecimals(value: string | number, maxDecimals: number) {
  const [integer, decimals] = value.toString().split('.')

  if (!decimals) return integer

  return `${integer}.${decimals.slice(0, maxDecimals)}`
}
