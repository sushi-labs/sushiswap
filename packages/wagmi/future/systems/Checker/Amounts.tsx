import { AddressZero } from '@ethersproject/constants'
import { Amount, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button } from '@sushiswap/ui/future/components/button'
import React, { FC, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { useBalances } from '../../../hooks'
import { CheckerButton } from './types'
import dynamic from 'next/dynamic'

export interface AmountsProps extends CheckerButton {
  chainId: number | undefined
  amounts: (Amount<Type> | undefined)[]
}

export const Component: FC<AmountsProps> = ({
 type, amounts,
  chainId,
  children,
  className,
  variant,
  fullWidth,
  as,
  size,
}) => {
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
          type={type}
        >
          Enter Amount
        </Button>
      )

    if (!sufficientBalance)
      return (
        <Button type={type} disabled className={className} variant={variant} as={as} fullWidth={fullWidth} size={size}>
          Insufficient Balance
        </Button>
      )

    return <>{children}</>
  }, [type, amountsAreDefined, as, children, className, fullWidth, size, sufficientBalance, variant])
}

export const Amounts = dynamic(() => Promise.resolve(Component), {
  ssr: false,
})
