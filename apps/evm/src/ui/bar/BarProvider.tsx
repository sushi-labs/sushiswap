'use client'

import { useContractReads } from '@sushiswap/wagmi'
import { FC, ReactNode, createContext, useContext, useMemo } from 'react'
import { erc20Abi } from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import { SUSHI_ADDRESS, XSUSHI_ADDRESS } from 'sushi/currency'

interface BarContext {
  totalSupply: bigint | undefined
  sushiBalance: bigint | undefined
  isLoading: boolean
  isError: boolean
}

const Context = createContext<BarContext | undefined>(undefined)

export const BarProvider: FC<{
  children: ReactNode
  watch?: boolean
}> = ({ children }) => {
  const { data, isLoading, isError } = useContractReads({
    contracts: [
      {
        address: XSUSHI_ADDRESS[ChainId.ETHEREUM],
        chainId: ChainId.ETHEREUM,
        abi: erc20Abi,
        functionName: 'totalSupply',
      },
      {
        address: SUSHI_ADDRESS[ChainId.ETHEREUM],
        chainId: ChainId.ETHEREUM,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [XSUSHI_ADDRESS[ChainId.ETHEREUM]],
      },
    ],
    staleTime: 60000, // 1min
  })

  const [totalSupply, sushiBalance] = useMemo(() => {
    const totalSupply = data?.[0]?.result
    const sushiBalance = data?.[1]?.result

    return [totalSupply, sushiBalance]
  }, [data])

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          totalSupply,
          sushiBalance,
          isLoading,
          isError,
        }),
        [isError, isLoading, totalSupply, sushiBalance],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const useSushiBar = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Pool Position Context')
  }

  return context
}
