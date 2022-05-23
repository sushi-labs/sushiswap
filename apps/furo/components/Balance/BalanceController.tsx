import { Token } from '@sushiswap/core-sdk'
import { Amount } from '@sushiswap/currency'
import { parseAmount } from 'functions/parseAmount'
import { useTokenBalance } from 'hooks'
import { FundSource } from 'hooks/useFundSourceToggler'
import { FC } from 'react'

type RenderProps = {
  loading: boolean
  error?: string
  balance?: Amount<Token>
}

type BaseProps = {
  account: string | undefined
  token: Token | undefined
  fundSource: FundSource | undefined
  amount: string | number | undefined
}

type BalanceController = BaseProps & {
  children?(props: RenderProps): JSX.Element
}

export const BalanceController: FC<BalanceController> = ({ amount, account, token, fundSource, children }) => {
  const { isLoading: loading, data: balance } = useTokenBalance(account, token, fundSource)

  const amountAsEntity = token && amount ? parseAmount(token, amount.toString()) : undefined
  const insufficientBalanceError =
    amountAsEntity && balance && amountAsEntity.greaterThan(balance) ? 'Insufficient Balance' : undefined

  if (!children) {
    return null
  }

  return children({ loading, error: account ? insufficientBalanceError : undefined, balance })
}
