'use client'

import { FC, ReactNode, createContext, useContext, useMemo } from 'react'
import { useBarData } from 'src/lib/bar/useBarData'
import { ChainId } from 'sushi/chain'
import { Amount, SUSHI, Type, XSUSHI, tryParseAmount } from 'sushi/currency'

interface BarContext {
  totalSupply: Amount<Type> | undefined
  sushiBalance: Amount<Type> | undefined
  apr: string | undefined
  isLoading: boolean
  isError: boolean
}

const Context = createContext<BarContext | undefined>(undefined)

export const BarProvider: FC<{
  children: ReactNode
  watch?: boolean
}> = ({ children }) => {
  const { data, isLoading, isError } = useBarData()

  const [sushiBalance, totalSupply, apr] = useMemo(
    () => [
      tryParseAmount(data?.xsushi?.sushiSupply, SUSHI[ChainId.ETHEREUM]),
      tryParseAmount(data?.xsushi?.xSushiSupply, XSUSHI[ChainId.ETHEREUM]),
      data?.xsushi?.apr12m ? data?.xsushi?.apr12m : undefined,
    ],
    [data],
  )

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          totalSupply,
          sushiBalance,
          apr,
          isLoading,
          isError,
        }),
        [sushiBalance, totalSupply, apr, isError, isLoading],
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
