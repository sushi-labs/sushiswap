'use client'

import {
  Button, CardContent, CardDescription, CardHeader, CardTitle, HoverCard, HoverCardContent, HoverCardTrigger,
} from '@sushiswap/ui'
import { createContext, useContext, useMemo } from 'react';
import { TRADE_MODES, TradeMode } from './config';
import { ShuffleIcon } from '@sushiswap/ui/icons/ShuffleIcon'

interface ContextState {
  switchTradeMode(mode: TradeMode): void;
  supportedTradeModes?: TradeMode[];
  tradeMode: TradeMode;
}

export const TradeModeContext = createContext<ContextState>({
  switchTradeMode: () => {},
  tradeMode: 'swap',
} as ContextState)

interface TradeModeOption {
  name: string;
  mode: TradeMode;
  active: boolean;
  onClick?: () => void;
  href?: string;
}

const OPTION_NAMES: Record<TradeMode, string> = {
  swap: 'Swap',
  limit: 'Limit',
  dca: 'DCA',
  'cross-chain-swap': 'Cross-Chain',
}

const useTradeModeOptions = (): TradeModeOption[] => {
  const context = useContext(TradeModeContext);
  const modes = context.supportedTradeModes ?? [...TRADE_MODES];

  return useMemo(() => modes.map(item => {
    return {
      mode: item,
      name: OPTION_NAMES[item],
      active: item === context.tradeMode,
      onClick: () => context.switchTradeMode(item),
    }
  }), [context]);
}

const TradeModeOptionButton = (item: TradeModeOption) => {
  if (item.mode === 'cross-chain-swap') {
    return (
      <HoverCard>
        <Button
          size="sm"
          variant={item.active ? 'secondary' : 'ghost'}
          onClick={item.onClick}
          href={item.href}
        >
          <HoverCardTrigger asChild>
            <span className="saturate-200 flex items-center gap-2 bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent">
              <ShuffleIcon width={20} height={20} className="text-blue" />
              {item.name}
            </span>
          </HoverCardTrigger>
        </Button>
        <HoverCardContent className="!p-0 max-w-[320px]">
          <CardHeader>
            <CardTitle>Cross-Chain Swap</CardTitle>
            <CardDescription>
              Swap tokens natively across 15 chains including Ethereum,
              Arbitrum, Optimism, Polygon, Base and more!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              target="_blank"
              className="text-sm text-blue hover:underline"
              href="https://www.sushi.com/blog/sushixswap-v2"
              rel="noreferrer"
            >
              Learn more.
            </a>
          </CardContent>
        </HoverCardContent>
      </HoverCard>
    )
  }

  return (
    <Button
      size="sm"
      variant={item.active ? 'secondary' : 'ghost'}
      onClick={item.onClick}
      href={item.href}
    >
      {item.name}
    </Button>
  )
}

export const TradeModeButtons = () => {
  const options = useTradeModeOptions();

  return <div className="flex gap-2 flex-wrap">
    { options.map((option, index) => <TradeModeOptionButton key={index} {...option} />) }
  </div>
}
