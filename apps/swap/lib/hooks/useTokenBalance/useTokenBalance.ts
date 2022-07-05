import { FundSource } from '@sushiswap/hooks'

import { type UseTokenBalance, type UseTokenBalances } from './types'
import { useTokenBentoboxBalance, useTokenBentoboxBalances } from './useTokenBentoboxBalance'
import { useTokenWalletBalance, useTokenWalletBalances } from './useTokenWalletBalance'

export const useTokenBalances: UseTokenBalances = (chainId, account, tokens, fundSource) => {
  const walletBalance = useTokenWalletBalances(chainId, account, tokens)
  const bentoBalance = useTokenBentoboxBalances(chainId, account, tokens)
  return fundSource === FundSource.BENTOBOX ? bentoBalance : walletBalance
}

export const useTokenBalance: UseTokenBalance = (chainId, account, token, fundSource) => {
  const walletBalance = useTokenWalletBalance(chainId, account, token)
  const bentoBalance = useTokenBentoboxBalance(chainId, account, token)
  return fundSource === FundSource.BENTOBOX ? bentoBalance : walletBalance
}
