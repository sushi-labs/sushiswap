'use client'

import {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react'
import { useBarData } from 'src/lib/stake'
import { Amount } from 'sushi'
import {
  EvmChainId,
  type EvmCurrency,
  SUSHI,
  SUSHI_ADDRESS,
  XSUSHI,
  XSUSHI_ADDRESS,
} from 'sushi/evm'
import { erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'

interface SushiBarContext {
  totalSupply: Amount<EvmCurrency> | undefined
  sushiBalance: Amount<EvmCurrency> | undefined
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
  } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: SUSHI_ADDRESS[EvmChainId.ETHEREUM],
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [XSUSHI_ADDRESS[EvmChainId.ETHEREUM]],
        chainId: EvmChainId.ETHEREUM,
      },
      {
        address: XSUSHI_ADDRESS[EvmChainId.ETHEREUM],
        chainId: EvmChainId.ETHEREUM,
        abi: erc20Abi,
        functionName: 'totalSupply' as const,
      },
    ],
    query: {
      select(data) {
        return [
          new Amount(SUSHI[EvmChainId.ETHEREUM], data[0]),
          new Amount(XSUSHI[EvmChainId.ETHEREUM], data[1]),
        ] as const
      },
      refetchInterval: 30000,
    },
  })

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
