import { getConfig, OrderType, Partners } from '@orbs-network/spot-react'
import { TWAP_SUPPORTED_CHAIN_IDS } from 'src/lib/swap/twap'
import { EvmChainId } from 'sushi/evm'

export const isTwapSupportedChainId = (chainId: number): chainId is number =>
  TWAP_SUPPORTED_CHAIN_IDS.includes(chainId as EvmChainId)

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
