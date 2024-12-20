'use client'

import { FC, ReactNode, createContext, useContext, useMemo } from 'react'
import { useBarData } from 'src/lib/stake'
import { useWatchByInterval } from 'src/lib/wagmi/hooks/watch/useWatchByInterval'
import { ChainId } from 'sushi/chain'
import {
  Amount,
  SUSHI,
  SUSHI_ADDRESS,
  Type,
  XSUSHI,
  XSUSHI_ADDRESS,
} from 'sushi/currency'
import { erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'

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
    data: balanceAndSupplyData,
    isLoading: isLoadingSushiBalanceData,
    isError: isErrorSushiBalanceData,
    queryKey: balanceAndSupplyQueryKey,
  } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: SUSHI_ADDRESS[ChainId.ETHEREUM],
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [XSUSHI_ADDRESS[ChainId.ETHEREUM]],
        chainId: ChainId.ETHEREUM,
      },
      {
        address: XSUSHI_ADDRESS[ChainId.ETHEREUM],
        chainId: ChainId.ETHEREUM,
        abi: erc20Abi,
        functionName: 'totalSupply' as const,
      },
    ],
    query: {
      select(data) {
        return [
          Amount.fromRawAmount(SUSHI[ChainId.ETHEREUM], data[0]),
          Amount.fromRawAmount(XSUSHI[ChainId.ETHEREUM], data[1]),
        ] as const
      },
      staleTime: 30000,
    },
  })

  useWatchByInterval({ key: balanceAndSupplyQueryKey, interval: 30000 })

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          sushiBalance: balanceAndSupplyData?.[0],
          totalSupply: balanceAndSupplyData?.[1],
          apy:
            data && data?.apr1m !== undefined
              ? Number(data.apr1m) * 12
              : undefined,
          isLoading: isLoadingBarData || isLoadingSushiBalanceData,
          isError: isErrorBarData || isErrorSushiBalanceData,
        }),
        [
          balanceAndSupplyData,
          data,
          isLoadingBarData,
          isLoadingSushiBalanceData,
          isErrorBarData,
          isErrorSushiBalanceData,
        ],
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
