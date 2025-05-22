'use client'

import { CHAIN_IDS_BY_TRADE_MODE } from 'src/ui/swap/trade/config'
import { useDerivedStateTrade } from 'src/ui/swap/trade/derivedstate-trade-provider'
import type { EvmChainId } from 'sushi/chain'
import { Header } from '../header'

const TradeHeader = ({ chainId }: { chainId: EvmChainId }) => {
  const {
    state: { tradeMode },
  } = useDerivedStateTrade()

  return (
    <Header
      chainId={chainId}
      supportedNetworks={CHAIN_IDS_BY_TRADE_MODE[tradeMode]}
    />
  )
}

export { TradeHeader as Header }
