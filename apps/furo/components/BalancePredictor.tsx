import { Amount, Token } from 'sushi/currency'
import { useInterval } from '@sushiswap/hooks'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'

interface BalancePredictor {
  balance: Amount<Token> | null | undefined
  startTime: Date | undefined
  endTime: Date | undefined
  totalAmount: Amount<Token> | undefined
  children(val: Amount<Token> | null | undefined): ReactNode
}

export const BalancePredictor: FC<BalancePredictor> = ({
  startTime,
  endTime,
  children,
  balance,
  totalAmount,
}) => {
  const [val, setVal] = useState<Amount<Token> | null | undefined>(balance)

  const amountPerSec = useMemo(() => {
    if (
      !balance ||
      !endTime ||
      !startTime ||
      !totalAmount ||
      Date.now() - endTime.getTime() > 0
    )
      return 0
    const duration = (endTime.getTime() - startTime.getTime()) / 1000
    return totalAmount.divide(duration)
  }, [balance, endTime, startTime, totalAmount])

  useInterval(() => {
    if (amountPerSec) {
      setVal((val) => val?.add(amountPerSec))
    }
  }, 1000)

  useEffect(() => {
    setVal(balance)
  }, [balance])

  return <>{children(val)}</>
}
