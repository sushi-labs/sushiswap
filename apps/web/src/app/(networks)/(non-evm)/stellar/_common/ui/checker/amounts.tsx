'use client'

import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { ZERO } from 'sushi/math'
import { useTokenBalances } from '~stellar/_common/lib/hooks/use-token-balances'
import type { Token } from '~stellar/_common/lib/types/token.type'

interface AmountsProps extends ButtonProps {
  amounts: {
    token: Token
    amount: number
  }[]
}

const Amounts: FC<AmountsProps> = ({
  type: _type,
  amounts,
  children,
  ...props
}) => {
  const amountsAreDefined = useMemo(
    () => amounts.every((el) => el.amount > ZERO),
    [amounts],
  )
  const tokens = useMemo(
    () => amounts.map((amount) => amount?.token),
    [amounts],
  )

  const { data: balances } = useTokenBalances(tokens)

  const sufficientBalance = useMemo(() => {
    if (!balances) return true

    return amounts.every((amount) => {
      const balance = balances[amount.token.code]
      if (typeof balance.balance !== 'bigint') return true

      return balance.balance >= amount.amount
    })
  }, [amounts, balances])

  if (!amountsAreDefined) {
    return (
      <Button id="amount-checker" {...props} disabled>
        Enter Amount
      </Button>
    )
  }

  if (!sufficientBalance) {
    return (
      <Button id="amount-checker" {...props} disabled>
        Insufficient Balance
      </Button>
    )
  }

  return <>{children}</>
}

export { Amounts, type AmountsProps }
