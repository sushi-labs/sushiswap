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
  const _mainCurrency = useMemo(
    () => (chainId === ChainId.CELO ? mainCurrency?.wrapped : mainCurrency),
    [chainId, mainCurrency]
  )
  const _otherCurrency = useMemo(
    () => (chainId === ChainId.CELO ? otherCurrency?.wrapped : otherCurrency),
    [chainId, otherCurrency]
  )
  const _amountSpecified = useMemo(
    () =>
      chainId === ChainId.CELO && amountSpecified
        ? Amount.fromRawAmount(amountSpecified.currency.wrapped, amountSpecified.quotient)
        : amountSpecified,
    [chainId, amountSpecified]
  )
  const trade = useFindTrade(chainId, tradeType, _amountSpecified, _mainCurrency, _otherCurrency)
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
