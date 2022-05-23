import { FundSource } from 'hooks/useFundSourceToggler'
import { UseTokenBalance, UseTokenBalances } from 'hooks/useTokenBalance/types'
import { useTokenBentoboxBalance, useTokenBentoboxBalances } from 'hooks/useTokenBalance/useTokenBentoboxBalance'
import { useTokenWalletBalance, useTokenWalletBalances } from 'hooks/useTokenBalance/useTokenWalletBalance'

export const useTokenBalances: UseTokenBalances = (account, tokens, fundSource) => {
  const walletBalance = useTokenWalletBalances(account, tokens)
  const bentoBalance = useTokenBentoboxBalances(account, tokens)
  return fundSource === FundSource.BENTOBOX ? bentoBalance : walletBalance
}

export const useTokenBalance: UseTokenBalance = (account, token, fundSource) => {
  const walletBalance = useTokenWalletBalance(account, token)
  const bentoBalance = useTokenBentoboxBalance(account, token)
  return fundSource === FundSource.BENTOBOX ? bentoBalance : walletBalance
}
