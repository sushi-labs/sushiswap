import { AddressZero } from '@ethersproject/constants'
import { Amount, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button } from '@sushiswap/ui/components/button'
import React, { FC, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { useBalances } from '../../../hooks'
import dynamic from 'next/dynamic'
import {ButtonProps} from "@sushiswap/ui/components/button";

export interface AmountsProps extends ButtonProps {
  chainId: number | undefined
  amounts: (Amount<Type> | undefined)[]
}

export const Component: FC<AmountsProps> = ({
 type, amounts,
  chainId,
  children,
   fullWidth = true,
  size = 'xl',
    ...props
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
            <Button id="amount-checker" disabled={true} fullWidth={fullWidth} size={size} {...props}>
                Insufficient Balance
            </Button>
        )

    return <>{children}</>
}

export const Amounts = dynamic(() => Promise.resolve(Component), {
  ssr: false,
})
