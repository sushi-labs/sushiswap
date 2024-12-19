'use client'

import { FC, ReactNode, createContext, useContext, useMemo } from 'react'
import { useBarData } from 'src/lib/stake'
import { useBalanceWeb3 } from 'src/lib/wagmi/hooks/balances/useBalanceWeb3'
import { useTotalSupply } from 'src/lib/wagmi/hooks/tokens/useTotalSupply'
import { ChainId } from 'sushi/chain'
import { Amount, SUSHI, Type, XSUSHI, XSUSHI_ADDRESS } from 'sushi/currency'

interface SushiBarContext {
  totalSupply: Amount<Type> | undefined
  sushiBalance: Amount<Type> | undefined
  apy: number | undefined
  isLoading: boolean
  isError: boolean
}

const Context = createContext<SushiBarContext | undefined>(undefined)

export const SushiBarProvider: FC<{
  children: ReactNode
  watch?: boolean
}> = ({ children }) => {
  const {
    data,
    isLoading: isLoadingBarData,
    isError: isErrorBarData,
  } = useBarData()
  const {
    data: sushiBalanceData,
    isLoading: isLoadingSushiBalanceData,
    isError: isErrorSushiBalanceData,
  } = useBalanceWeb3({
    chainId: ChainId.ETHEREUM,
    currency: SUSHI[ChainId.ETHEREUM],
    account: XSUSHI_ADDRESS[ChainId.ETHEREUM],
  })
  const totalSupply = useTotalSupply(XSUSHI[ChainId.ETHEREUM])

  const [sushiBalance, apy, isLoading, isError] = useMemo(
    () => [
      sushiBalanceData || undefined,
      data && data?.apr1m !== undefined ? Number(data.apr1m) * 12 : undefined,
      isLoadingBarData ||
        isLoadingSushiBalanceData ||
        totalSupply === undefined,
      isErrorBarData || isErrorSushiBalanceData,
    ],
    [
      sushiBalanceData,
      data,
      isLoadingBarData,
      isLoadingSushiBalanceData,
      isErrorBarData,
      isErrorSushiBalanceData,
      totalSupply,
    ],
  )

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          totalSupply,
          sushiBalance,
          apy,
          isLoading,
          isError,
        }),
        [sushiBalance, totalSupply, apy, isError, isLoading],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const useSushiBar = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside SushiBar Context')
  }

  return context
}
