import {
  FundSource,
  UseTokenBalance,
  UseTokenBalances,
  useTokenBentoboxBalance,
  useTokenBentoboxBalances,
  useTokenWalletBalance,
  useTokenWalletBalances,
} from 'hooks'

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
