import { Amount, Currency } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { ErrorState, LoadingState, SuccessState, useWalletBalance } from 'lib/hooks'
import { FC } from 'react'

export type BalanceControllerBaseProps = {
  account: string | undefined
  currency: Currency | undefined
  fundSource: FundSource | undefined
}

type BalanceController = BalanceControllerBaseProps & {
  children?(
    props: SuccessState<Amount<Currency>> | LoadingState<Amount<Currency>> | ErrorState<Amount<Currency>>
  ): JSX.Element
}

export const BalanceController: FC<BalanceController> = ({ account, currency, fundSource, children }) => {
  const data = useWalletBalance(account, currency, fundSource)

  if (!children) {
    return null
  }

  return children(data)
}
