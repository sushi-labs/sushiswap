import { AddressZero } from '@ethersproject/constants'
import { Amount, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button } from '@sushiswap/ui13/components/button'
import React from 'react'
import { FC, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { useBalances } from '../../hooks'
import { CheckerButton } from './types'

export interface AmountsProps extends CheckerButton {
  chainId: number | undefined
  amounts: (Amount<Type> | undefined)[]
}

export const Amounts: FC<AmountsProps> = ({ amounts, chainId, children, className, variant, fullWidth, as, size }) => {
  const { address } = useAccount()
  const amountsAreDefined = useMemo(() => amounts.every((el) => el?.greaterThan(ZERO)), [amounts])
  const currencies = useMemo(() => amounts.map((amount) => amount?.currency), [amounts])

  const { data: balances } = useBalances({
    currencies,
    chainId,
    account: address,
    enabled: amountsAreDefined,
  })

  const sufficientBalance = useMemo(() => {
    return amounts?.every((amount) => {
      if (!amount) return true
      return !balances?.[amount.currency.isNative ? AddressZero : amount.currency.wrapped.address]?.[
        FundSource.WALLET
      ]?.lessThan(amount)
    })
  }, [amounts, balances])

  return useMemo(() => {
    if (!amountsAreDefined)
      return (
        <Button
          id="amount-checker"
          disabled
          className={className}
          variant={variant}
          as={as}
          fullWidth={fullWidth}
          size={size}
        >
          Enter Amount
        </Button>
      )

    if (!sufficientBalance)
      return (
        <Button disabled className={className} variant={variant} as={as} fullWidth={fullWidth} size={size}>
          Insufficient Balance
        </Button>
      )

    return <>{children}</>
  }, [amountsAreDefined, as, children, className, fullWidth, size, sufficientBalance, variant])
}
