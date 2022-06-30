import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { useMemo } from 'react'
import { useContractInfiniteReads } from 'wagmi'

import { BalanceMap } from './types'
import { useBentoBalance, useBentoBalances } from './useBentoBalance'
import { useWalletBalance, useWalletBalances } from './useWalletBalance'

type UseBalancesParams = {
  account: string | undefined
  currencies: Type[]
  chainId?: ChainId
}

type UseBalances = (params: UseBalancesParams) => Pick<
  ReturnType<typeof useContractInfiniteReads>,
  'isError' | 'isLoading'
> & {
  data: BalanceMap
}

export const useBalances: UseBalances = (params) => {
  const _params = useMemo(
    () => ({ chainId: params.chainId, currencies: params.currencies, account: params.account }),
    [params.chainId, params.account, params.currencies]
  )

  const { data: walletBalances, isError: walletError, isLoading: walletLoading } = useWalletBalances(_params)
  const { data: bentoBalances, isError: bentoError, isLoading: bentoLoading } = useBentoBalances(_params)

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
  currency: Type
  chainId?: ChainId
}

type UseBalance = (params: UseBalanceParams) => Pick<
  ReturnType<typeof useContractInfiniteReads>,
  'isError' | 'isLoading'
> & {
  data: Record<FundSource, Amount<Type> | undefined>
}

export const useBalance: UseBalance = (params) => {
  const { data: walletBalance, isError: walletError, isLoading: walletLoading } = useWalletBalance(params)
  const { data: bentoBalance, isError: bentoError, isLoading: bentoLoading } = useBentoBalance(params)

  return useMemo(
    () => ({
      isError: walletError || bentoError,
      isLoading: walletLoading || bentoLoading,
      data: {
        [FundSource.WALLET]: walletBalance?.[params.currency.isNative ? AddressZero : params.currency.wrapped.address],
        [FundSource.BENTOBOX]: bentoBalance?.[params.currency.isNative ? AddressZero : params.currency.wrapped.address],
      },
    }),
    [
      walletError,
      bentoError,
      walletLoading,
      bentoLoading,
      walletBalance,
      params.currency.isNative,
      params.currency.wrapped.address,
      bentoBalance,
    ]
  )
}
