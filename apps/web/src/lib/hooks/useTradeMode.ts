import { usePathname } from 'next/navigation'
import type { TradeMode } from 'src/ui/swap/trade/config'
import { TRADE_MODES } from 'src/ui/swap/trade/config'

export const useTradeMode = (): { tradeMode: TradeMode } => {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const tradeMode = segments.find((segment) =>
    TRADE_MODES.includes(segment as TradeMode),
  ) as TradeMode | undefined

  return { tradeMode: tradeMode ?? 'swap' }
}
