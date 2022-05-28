import { Amount, Native, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { useBalance } from 'wagmi'

import { ErrorState, LoadingState, SuccessState } from './types'
import { useTokenBalance } from './useTokenBalance'

export const useWalletBalance = (
  account: string | undefined,
  currency: Type | undefined,
  fundSource?: FundSource
): SuccessState<Amount<Type>> | LoadingState<Amount<Type>> | ErrorState<Amount<Type>> => {
  const {
    data: nativeBalance,
    isLoading: isBalanceLoading,
    error: isBalanceError,
  } = useBalance({ addressOrName: account })

  const balance = useTokenBalance(account, currency?.wrapped, fundSource)

  if (fundSource === FundSource.BENTOBOX) {
    return balance
  }

  if (currency instanceof Native) {
    return {
      isLoading: isBalanceLoading,
      data: nativeBalance?.value ? Amount.fromRawAmount(currency, nativeBalance.value) : undefined,
      isError: isBalanceError,
    }
  }

  return balance
}
