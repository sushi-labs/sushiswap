import { Token } from '@sushiswap/core-sdk'
import { Amount } from '@sushiswap/currency'
import { useTokenBalance } from 'hooks'
import { FundSource } from 'hooks/useFundSourceToggler'
import { ErrorState, LoadingState, SuccessState } from 'hooks/useTokenBalance/types'
import { FC } from 'react'

export type BalanceControllerBaseProps = {
  account: string | undefined
  token: Token | undefined
  fundSource: FundSource | undefined
}

type BalanceController = BalanceControllerBaseProps & {
  children?(props: SuccessState<Amount<Token>> | LoadingState<Amount<Token>> | ErrorState<Amount<Token>>): JSX.Element
}

export const BalanceController: FC<BalanceController> = ({ account, token, fundSource, children }) => {
  const data = useTokenBalance(account, token, fundSource)

  if (!children) {
    return null
  }

  return children(data)
}
