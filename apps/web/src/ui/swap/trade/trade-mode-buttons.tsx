'use client'

import { Button } from '@sushiswap/ui'
import { createContext, useContext, useMemo } from 'react'
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
  const modes = context.supportedTradeModes ?? [...TRADE_MODES]
  if (context.tradeMode === 'fiat') {
    //only return swap and fiat
    return modes
      .filter((mode) => mode === 'swap' || mode === 'fiat')
      .map((item) => ({
        mode: item,
        name: item === 'swap' ? 'Swap' : OPTION_NAMES[item],
        active: item === context.tradeMode,
        onClick: () => context.switchTradeMode(item),
      }))
  }

  return useMemo(() => {
    return modes.slice(0, modes.length - 1).map((item) => {
      return {
        mode: item,
        name: OPTION_NAMES[item],
        active: item === context.tradeMode,
        onClick: () => context.switchTradeMode(item),
      }
    })
  }, [modes, context])
}

//@DEV temp taking out cross chain swap for now to show full UI
const TradeModeOptionButton = (item: TradeModeOption) => {
  // if (item.mode === "cross-chain-swap") {
  // 	return (
  // 		<HoverCard>
  // 			<Button
  // 				size="sm"
  // 				variant={item.active ? "secondary" : "ghost"}
  // 				onClick={item.onClick}
  // 				href={item.href}>
  // 				<HoverCardTrigger asChild>
  // 					<span className="flex items-center gap-2 text-transparent saturate-200 bg-gradient-to-r from-blue to-pink bg-clip-text">
  // 						<ShuffleIcon width={20} height={20} className="text-blue" />
  // 						{item.name}
  // 					</span>
  // 				</HoverCardTrigger>
  // 			</Button>
  // 			<HoverCardContent className="!p-0 max-w-[320px]">
  // 				<CardHeader>
  // 					<CardTitle>Cross-Chain Swap</CardTitle>
  // 					<CardDescription>
  // 						Swap tokens natively across 15 chains including Ethereum, Arbitrum, Optimism, Polygon, Base and
  // 						more!
  // 					</CardDescription>
  // 				</CardHeader>
  // 				<CardContent>
  // 					<a
  // 						target="_blank"
  // 						className="text-sm text-blue hover:underline"
  // 						href="https://www.sushi.com/blog/sushixswap-v2"
  // 						rel="noreferrer">
  // 						Learn more.
  // 					</a>
  // 				</CardContent>
  // 			</HoverCardContent>
  // 		</HoverCard>
  // 	);
  // }

  return (
    <Button
      size="sm"
      variant={item.active ? 'secondary' : 'ghost'}
      onClick={item.onClick}
      href={item.href}
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
