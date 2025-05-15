'use client'

import { Container } from '@sushiswap/ui'
import { TradeWidget } from 'src/ui/swap/trade/trade-widget';
import { useSkaleEuropaFaucet } from 'src/lib/hooks';
import { useDerivedStateSimpleTrade } from 'src/ui/swap/trade/derivedstate-simple-trade-provider';
import { useHeaderNetworkSelector } from 'src/lib/wagmi/components/header-network-selector';
import { CHAIN_IDS_BY_TRADE_MODE, TradeMode } from 'src/ui/swap/trade/config';
import { EvmChainId } from 'sushi/chain';
import { NonStandardChainId } from 'src/config';

const chainIdsByTradeMode: Record<TradeMode, (EvmChainId | NonStandardChainId)[] | null> = {
  ...CHAIN_IDS_BY_TRADE_MODE as any,
  'swap': null
};

export default function TradePage() {
  const { state: { tradeMode } } = useDerivedStateSimpleTrade()
  useHeaderNetworkSelector(chainIdsByTradeMode[tradeMode])
  useSkaleEuropaFaucet();

  return (
    <Container maxWidth="lg" className="px-4">
      <TradeWidget />
    </Container>
  )
}
