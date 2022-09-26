import { ChainId } from '@sushiswap/chain'
import { Amount, Type as Currency } from '@sushiswap/currency'
import { TradeType } from '@sushiswap/exchange'
import { TradeOutput } from '@sushiswap/wagmi'
import { createContext, FC, ReactNode, useContext, useMemo } from 'react'

import { useTrade as useFindTrade } from '../lib/hooks/useTrade'

interface TradeContext {
  trade: TradeOutput
  isLoading: boolean
  isError: boolean
}

const Context = createContext<TradeContext | undefined>(undefined)

interface _TradeProviderProps {
  chainId: ChainId
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT
  amountSpecified: Amount<Currency> | undefined
  mainCurrency: Currency | undefined
  otherCurrency: Currency | undefined
  children: ReactNode
}

export const TradeProvider: FC<_TradeProviderProps> = ({
  chainId,
  tradeType,
  amountSpecified,
  mainCurrency,
  otherCurrency,
  children,
}) => {
  const trade = useFindTrade(chainId, tradeType, amountSpecified, mainCurrency, otherCurrency)
  return (
    <Context.Provider value={useMemo(() => ({ trade, isError: false, isLoading: false }), [trade])}>
      {children}
    </Context.Provider>
  )
}

export const useTrade = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Pool Position Staked Context')
  }

  return context
}
