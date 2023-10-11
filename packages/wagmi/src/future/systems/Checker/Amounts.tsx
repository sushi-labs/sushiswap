'use client'

import {AddressZero} from '@ethersproject/constants'
import {Button, ButtonProps} from '@sushiswap/ui/components/button'
import React, {FC, useMemo} from 'react'
import {ZERO} from 'sushi'
import {ChainId} from 'sushi/chain'
import {Amount, Type} from 'sushi/currency'
import {useAccount} from 'wagmi'

import {useBalancesWeb3} from '../../hooks'

interface AmountsProps extends ButtonProps {
  chainId: ChainId | undefined
  amounts: (Amount<Type> | undefined)[]
}

const Amounts: FC<AmountsProps> = ({
  type,
  amounts,
  chainId,
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const { address } = useAccount()
  const amountsAreDefined = useMemo(
    () => amounts.every((el) => el?.greaterThan(ZERO)),
    [amounts],
  )
  const currencies = useMemo(
    () => amounts.map((amount) => amount?.currency),
    [amounts],
  )

  const { data: balances } = useBalancesWeb3({
    currencies,
    chainId,
    account: address,
    enabled: amountsAreDefined,
  })

  const sufficientBalance = useMemo(() => {
    return amounts?.every((amount) => {
      if (!amount) return true
      return !balances?.[
        amount.currency.isNative ? AddressZero : amount.currency.wrapped.address
      ]?.lessThan(amount)
    })
  }, [amounts, balances])

  if (!amountsAreDefined)
    return (
      <Button
        id="amount-checker"
        disabled={true}
        fullWidth={fullWidth}
        size={size}
        {...props}
      >
        Enter Amount
      </Button>
    )

  if (!sufficientBalance)
    return (
      <Button
        id="amount-checker"
        disabled={true}
        fullWidth={fullWidth}
        size={size}
        {...props}
      >
        Insufficient Balance
      </Button>
    )

  return <>{children}</>
}

export { Amounts, type AmountsProps }
