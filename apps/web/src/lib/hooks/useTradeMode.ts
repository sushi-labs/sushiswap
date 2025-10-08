import { usePathname } from 'next/navigation'
import {
  TRADE_MODES,
  type TradeMode,
} from '~evm/[chainId]/[trade]/_ui/swap/trade/config'

export const useTradeMode = (): { tradeMode: TradeMode } => {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const tradeMode = segments.find((segment) =>
    TRADE_MODES.includes(segment as TradeMode),
  ) as TradeMode | undefined

  return { tradeMode: tradeMode ?? 'swap' }
}
