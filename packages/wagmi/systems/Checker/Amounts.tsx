import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import { FC, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { useBalances } from '../../hooks'
import { CheckerButton } from './types'

export interface AmountsProps extends CheckerButton {
  chainId: ChainId
  amounts: (Amount<Type> | undefined)[]
  fundSource: FundSource
}

export const Amounts: FC<AmountsProps> = ({ amounts, fundSource, chainId, children, ...rest }) => {
  const { address } = useAccount()
  const amountsAreDefined = useMemo(() => amounts.every((el) => !!el), [amounts])

  const { data: balances } = useBalances({
    currencies: amounts.map((amount) => amount?.currency),
    chainId,
    account: address,
    enabled: amountsAreDefined,
  })

  const sufficientBalance = useMemo(() => {
    return amounts?.every((amount) => {
      if (!amount) return true
      return !balances?.[amount.currency.isNative ? AddressZero : amount.currency.wrapped.address]?.[
        fundSource
      ]?.lessThan(amount)
    })
  }, [amounts, balances, fundSource])

  if (!amountsAreDefined)
    return (
      <Button disabled {...rest}>
        Enter Amount
      </Button>
    )

  if (!sufficientBalance)
    return (
      <Button disabled {...rest}>
        Insufficient Balance
      </Button>
    )

  return <>{children}</>
}
