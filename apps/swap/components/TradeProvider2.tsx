import { ChainId } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import { createContext, FC, ReactNode, useContext, useMemo } from 'react'

import { useSettings } from '../lib/state/storage'
import { useAccount, useBlockNumber, useFeeData } from 'wagmi'
import { useTrade as _useTrade } from '@sushiswap/react-query'

const Context = createContext<ReturnType<typeof _useTrade> | undefined>(undefined)

interface _TradeProviderProps {
  chainId: ChainId
  amountSpecified: Amount<Type> | undefined
  mainCurrency: Type | undefined
  otherCurrency: Type | undefined
  children: ReactNode
}

export const TradeProvider2: FC<_TradeProviderProps> = ({
  chainId,
  amountSpecified,
  mainCurrency,
  otherCurrency,
  children,
}) => {
  const { address: account } = useAccount()

  const _mainCurrency = useMemo(
    () => (chainId && chainId === ChainId.CELO ? mainCurrency?.wrapped : mainCurrency),
    [chainId, mainCurrency]
  )
  const _otherCurrency = useMemo(
    () => (chainId && chainId === ChainId.CELO ? otherCurrency?.wrapped : otherCurrency),
    [chainId, otherCurrency]
  )
  const _amountSpecified = useMemo(
    () =>
      chainId === ChainId.CELO && amountSpecified
        ? Amount.fromRawAmount(amountSpecified.currency.wrapped, amountSpecified.quotient)
        : amountSpecified,
    [chainId, amountSpecified]
  )

  const [{ slippageTolerance, slippageToleranceType }] = useSettings()
  const { data: feeData } = useFeeData()
  const { data: blockNumber } = useBlockNumber({ chainId, watch: true })
  const trade = _useTrade({
    chainId,
    fromToken: _mainCurrency,
    toToken: _otherCurrency,
    amount: _amountSpecified,
    slippagePercentage: slippageToleranceType === 'auto' ? '0.5' : `${slippageTolerance}`,
    gasPrice: feeData?.gasPrice?.toNumber(),
    blockNumber,
    recipient: account,
  })

  return <Context.Provider value={trade}>{children}</Context.Provider>
}

export const useTrade2 = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Pool Position Staked Context')
  }

  return context
}
