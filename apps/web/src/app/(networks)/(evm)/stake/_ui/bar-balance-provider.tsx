'use client'

import {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react'
import { Amount } from 'sushi'
import { EvmChainId, type EvmCurrency, SUSHI, XSUSHI } from 'sushi/evm'
import { useAccount } from 'wagmi'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'

interface BarBalanceContext {
  sushiBalance: Amount<EvmCurrency>
  xSushiBalance: Amount<EvmCurrency>
  isConnected: boolean
  isLoading: boolean
  isError: boolean
}

const Context = createContext<BarBalanceContext | undefined>(undefined)

export const BarBalanceProvider: FC<{
  children: ReactNode
  watch?: boolean
}> = ({ children }) => {
  const { isConnected } = useAccount()

  const {
    data: sushiBalance,
    isLoading: isSushiBalanceLoading,
    isError: isSushiBalanceError,
  } = useAmountBalance(SUSHI[EvmChainId.ETHEREUM])

  const {
    data: xSushiBalance,
    isLoading: isXSushiBalanceLoading,
    isError: isXSushiBalanceError,
  } = useAmountBalance(XSUSHI[EvmChainId.ETHEREUM])

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          sushiBalance:
            sushiBalance ?? new Amount(SUSHI[EvmChainId.ETHEREUM], 0),
          xSushiBalance:
            xSushiBalance ?? new Amount(XSUSHI[EvmChainId.ETHEREUM], 0),
          isConnected,
          isLoading:
            isConnected && (isSushiBalanceLoading || isXSushiBalanceLoading),
          isError: isConnected && (isSushiBalanceError || isXSushiBalanceError),
        }),
        [
          sushiBalance,
          xSushiBalance,
          isConnected,
          isSushiBalanceLoading,
          isXSushiBalanceLoading,
          isSushiBalanceError,
          isXSushiBalanceError,
        ],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const useBarBalance = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside BarBalance Context')
  }

  return context
}
