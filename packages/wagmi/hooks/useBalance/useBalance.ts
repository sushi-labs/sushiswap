import { ChainId } from '@sushiswap/chain'
import { Amount, Token, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { useContractInfiniteReads } from 'wagmi'

import { useBentoBalance, useBentoBalances } from './useBentoBalance'
import { useWalletBalance, useWalletBalances } from './useWalletBalance'

type UseBalancesParams = {
  account: string | undefined
  tokens: Token[]
  chainId?: ChainId
  fundSource?: FundSource
}

type UseBalances = (params: UseBalancesParams) => Pick<
  ReturnType<typeof useContractInfiniteReads>,
  'isError' | 'isLoading'
> & {
  data: Record<string, Amount<Type>> | undefined
}

export const useBalances: UseBalances = ({ fundSource, ...rest }) => {
  const walletBalances = useWalletBalances(rest)
  const bentoBalances = useBentoBalances(rest)
  return fundSource === FundSource.BENTOBOX ? bentoBalances : walletBalances
}

type UseBalanceParams = {
  account: string | undefined
  token: Token
  chainId?: ChainId
  fundSource?: FundSource
}

type UseBalance = (params: UseBalanceParams) => Pick<
  ReturnType<typeof useContractInfiniteReads>,
  'isError' | 'isLoading'
> & {
  data: Record<string, Amount<Type>> | undefined
}

export const useBalance: UseBalance = ({ fundSource, ...rest }) => {
  const walletBalance = useWalletBalance(rest)
  const bentoBalance = useBentoBalance(rest)
  return fundSource === FundSource.BENTOBOX ? bentoBalance : walletBalance
}
