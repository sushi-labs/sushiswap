import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { useMemo } from 'react'
import { useContractInfiniteReads } from 'wagmi'

import { BalanceMap } from './types'
import { useBentoBalance, useBentoBalances } from './useBentoBalance'
import { useWalletBalance, useWalletBalances } from './useWalletBalance'

type UseBalancesParams = {
  account: string | undefined
  tokens: Token[]
  chainId?: ChainId
}

type UseBalances = (params: UseBalancesParams) => Pick<
  ReturnType<typeof useContractInfiniteReads>,
  'isError' | 'isLoading'
> & {
  data: BalanceMap
}

export const useBalances: UseBalances = (params) => {
  const { data: walletBalances, isError: walletError, isLoading: walletLoading } = useWalletBalances(params)
  const { data: bentoBalances, isError: bentoError, isLoading: bentoLoading } = useBentoBalances(params)

  const balances = useMemo(
    () =>
      walletBalances
        ? Object.entries(walletBalances).reduce<BalanceMap>((acc, [address, balance]) => {
            acc[address] = {
              [FundSource.WALLET]: balance,
              [FundSource.BENTOBOX]: bentoBalances?.[address],
            }
            return acc
          }, {})
        : {},
    [walletBalances, bentoBalances]
  )

  return useMemo(
    () => ({
      isError: walletError || bentoError,
      isLoading: walletLoading || bentoLoading,
      data: balances,
    }),
    [walletError, bentoError, walletLoading, bentoLoading, balances]
  )
}

type UseBalanceParams = {
  account: string | undefined
  token: Token
  chainId?: ChainId
}

type UseBalance = (params: UseBalanceParams) => Pick<
  ReturnType<typeof useContractInfiniteReads>,
  'isError' | 'isLoading'
> & {
  data: BalanceMap
}

export const useBalance: UseBalance = (params) => {
  const { data: walletBalance, isError: walletError, isLoading: walletLoading } = useWalletBalance(params)
  const { data: bentoBalance, isError: bentoError, isLoading: bentoLoading } = useBentoBalance(params)

  return useMemo(
    () => ({
      isError: walletError || bentoError,
      isLoading: walletLoading || bentoLoading,
      data: {
        [params.token.wrapped.address]: {
          [FundSource.WALLET]: walletBalance?.[params.token.wrapped.address],
          [FundSource.BENTOBOX]: bentoBalance?.[params.token.wrapped.address],
        },
      },
    }),
    [walletError, bentoError, walletLoading, bentoLoading, params.token, walletBalance, bentoBalance]
  )
}
