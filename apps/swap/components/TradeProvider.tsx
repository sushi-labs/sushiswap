import { ChainId } from '@sushiswap/chain'
import { Amount, Type as Currency } from '@sushiswap/currency'
import { TradeType } from '@sushiswap/exchange'
import { createContext, FC, ReactNode, useContext, useMemo } from 'react'

import { useTrade as useFindTrade, UseTradeOutput } from '../lib/hooks/useTrade'

interface TradeContext {
  trade: UseTradeOutput
}

const Context = createContext<TradeContext | undefined>(undefined)

interface TradeProviderProps {
  chainId: ChainId
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT
  amountSpecified: Amount<Currency> | undefined
  mainCurrency: Currency | undefined
  otherCurrency: Currency | undefined
  children: ReactNode
}

export const TradeProvider: FC<TradeProviderProps> = ({
  chainId,
  tradeType,
  amountSpecified,
  mainCurrency,
  otherCurrency,
  children,
}) => {
  if (!amountSpecified || !mainCurrency || !otherCurrency) {
    return <Context.Provider value={{ trade: undefined }}>{children}</Context.Provider>
  }

  return (
    <_TradeProvider
      chainId={chainId}
      tradeType={tradeType}
      amountSpecified={amountSpecified}
      mainCurrency={mainCurrency}
      otherCurrency={otherCurrency}
    >
      {children}
    </_TradeProvider>
  )
}

interface _TradeProviderProps {
  chainId: ChainId
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT
  amountSpecified: Amount<Currency>
  mainCurrency: Currency
  otherCurrency: Currency
  children: ReactNode
}

const _TradeProvider: FC<_TradeProviderProps> = ({
  chainId,
  tradeType,
  amountSpecified,
  mainCurrency,
  otherCurrency,
  children,
}) => {
  const trade = useFindTrade({
    chainId,
    tradeType,
    mainCurrency,
    otherCurrency,
    amountSpecified,
  })

  return <Context.Provider value={useMemo(() => ({ trade }), [trade])}>{children}</Context.Provider>
}

export const useTrade = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Pool Position Staked Context')
  }

  return context.trade
}
