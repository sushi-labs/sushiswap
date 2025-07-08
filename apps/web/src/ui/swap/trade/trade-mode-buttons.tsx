'use client'

import { Button } from '@sushiswap/ui'
import { createContext, useContext, useMemo } from 'react'
import { isTwapSupportedChainId } from 'src/config'
import { useCurrentChainId } from 'src/lib/hooks/useCurrentChainId'
import { useTradeMode } from 'src/lib/hooks/useTradeMode'
import { TRADE_MODES, type TradeMode } from './config'

interface ContextState {
  switchTradeMode(mode: TradeMode): void
  supportedTradeModes?: TradeMode[]
  tradeMode: TradeMode
}

export const TradeModeContext = createContext<ContextState>({
  switchTradeMode: () => {},
  tradeMode: 'swap',
} as ContextState)

interface TradeModeOption {
  name: string
  mode: TradeMode
  active: boolean
  onClick?: () => void
  href?: string
}

const OPTION_NAMES: Record<TradeMode, string> = {
  swap: 'Market',
  limit: 'Limit',
  dca: 'DCA',
  //@DEV temp taking out cross chain swap for now to show full UI
  // "cross-chain-swap": "Cross-Chain",
  fiat: 'Buy Crypto',
}

const useTradeModeOptions = (): TradeModeOption[] => {
  const context = useContext(TradeModeContext)
  const modes = [...TRADE_MODES]

  const { tradeMode } = useTradeMode()
  if (context.tradeMode === 'fiat') {
    //only return swap and fiat
    return modes
      .filter((mode) => mode === 'swap' || mode === 'fiat')
      .map((item) => ({
        mode: item,
        name: item === 'swap' ? 'Swap' : OPTION_NAMES[item],
        active: item === tradeMode,
        onClick: () => context.switchTradeMode(item),
      }))
  }

  return useMemo(() => {
    return modes.slice(0, modes.length - 1).map((item) => {
      return {
        mode: item,
        name: OPTION_NAMES[item],
        active: item === tradeMode,
        onClick: () => context.switchTradeMode(item),
      }
    })
  }, [context, tradeMode, modes.length, modes.slice])
}

const TradeModeOptionButton = (item: TradeModeOption) => {
  const { chainId } = useCurrentChainId()

  const isDisabled = useMemo(() => {
    if (item.mode === 'limit' || item.mode === 'dca') {
      return !isTwapSupportedChainId(chainId)
    }
    return false
  }, [chainId, item])

  return (
    <Button
      size="sm"
      variant={item.active ? 'secondary' : 'ghost'}
      onClick={item.onClick}
      href={item.href}
      disabled={isDisabled}
      className={item.active ? '!bg-[#0000001F] dark:!bg-[#FFFFFF1F]' : ''}
    >
      {item.name}
    </Button>
  )
}

export const TradeModeButtons = () => {
  const options = useTradeModeOptions()

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option, index) => (
        <TradeModeOptionButton key={index} {...option} />
      ))}
    </div>
  )
}
