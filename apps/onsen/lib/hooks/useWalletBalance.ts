import { Amount, Currency, Native } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { useBalance } from 'wagmi'

import { ErrorState, LoadingState, SuccessState } from './types'
import { useTokenBalance } from './useTokenBalance'

export const useWalletBalance = (
  account: string | undefined,
  currency: Currency | undefined,
  fundSource?: FundSource
): SuccessState<Amount<Currency>> | LoadingState<Amount<Currency>> | ErrorState<Amount<Currency>> => {
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
      data: nativeBalance ? Amount.fromRawAmount(currency, nativeBalance.value.toString()) : null,
      isError: !isBalanceError,
    } as SuccessState<Amount<Currency>>
  } else {
    return balance
  }
}
