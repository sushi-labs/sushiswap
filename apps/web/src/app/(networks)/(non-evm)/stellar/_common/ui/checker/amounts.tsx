'use client'

import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { ZERO } from 'sushi/math'
import { useTokenBalances } from '~stellar/_common/lib/hooks/token/use-token-balance'
import type {
  Token,
  TokenWithBalance,
} from '~stellar/_common/lib/types/token.type'
import { useStellarWallet } from '~stellar/providers'

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
  const { connectedAddress } = useStellarWallet()
  const amountsAreDefined = useMemo(
    () => amounts.every((el) => el.amount > ZERO),
    [amounts],
  )
  const tokens = useMemo(
    () => amounts.map((amount) => amount?.token),
    [amounts],
  )

  const { data: tokensWithBalances } = useTokenBalances(
    connectedAddress,
    tokens,
  )

  const sufficientBalance = useMemo(() => {
    if (!tokensWithBalances) return true

    return amounts.every((amount) => {
      const balance = tokensWithBalances.find(
        (token: TokenWithBalance) => token.code === amount.token.code,
      )?.balance
      if (typeof balance !== 'bigint') return true

      return balance >= amount.amount
    })
  }, [amounts, tokensWithBalances])

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
